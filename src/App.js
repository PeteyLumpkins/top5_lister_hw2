import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import ControlModal from './components/ControlModal';

import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js';

import jsTPS from './jstps/jsTPS.js';
import ChangeItem_Transaction from './jstps/transactions/ChangeItem_Transaction.js';
import MoveItem_Transaction from './jstps/transactions/MoveItem_Transaction.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // JSTPS WILL MANAGE UNDO AND REDO OPERATIONS LIKE BEFORE 
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            deleteListKeyNamePair: null,
            sessionData : loadedSessionData
        }
    }

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }

    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK

        // Clear all transactions before setting the new list
        this.tps.clearAllTransactions();

        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData)
        });
    }

    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            },
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        if (this.state.currentList !== null && key != this.state.currentList.key) {
            this.tps.clearAllTransactions();
        }

        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData,
        }), () => {
            // Clears transaction stack when we load a new list
        });
    }

    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.tps.clearAllTransactions();

        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
           
        });
    }

    /**
     * Deletes the list that the user is currently trying to delete. This list is
     * indicated by @var deleteListKeyNamePair 
     */
    removeList = (keyNamePair) => {

        this.db.mutationRemoveList(keyNamePair.key);

        let newSessionData = this.state.sessionData;
        let newCurrentList = this.state.currentList;

        for (let i = 0; i < newSessionData.keyNamePairs.length; i++) {
            if (newSessionData.keyNamePairs[i].key === keyNamePair.key) {
                newSessionData.keyNamePairs.splice(i, 1);
            }
        }

        this.db.mutationUpdateSessionData(newSessionData);

        if (this.state.currentList !== null && keyNamePair.key === this.state.currentList.key) {
            newCurrentList = null;
            this.tps.clearAllTransactions();
        }

        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: this.db.queryGetSessionData(),
            deleteListKeyNamePair: null
        }));
    }

    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.showDeleteListModal(keyNamePair);
    }

    /**
     * Undos an operation on the current list
     */
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.loadList(this.state.currentList.key);
        }
    }

    /**
     * Redos an operation on the current list
     */
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            this.loadList(this.state.currentList.key);
        }
    }

    /**
     * Adds an @type {ChangeItem_Transaction} to the transaction stack
     * 
     * @param {integer} index - the index of the item we want to change
     * @param {string} oldText - the previous text at the given position
     * @param {string} newText - the new text at the given position
     */
    addChangeItemTransaction = (index, oldText, newText) => {
        let transaction = new ChangeItem_Transaction(this, index, oldText, newText);
        this.tps.addTransaction(transaction);
        this.loadList(this.state.currentList.key);
    }

    /**
     * Adds an @type {MoveItem_Transaction} to the transaction stack
     * 
     * @param {integer} oldIndex - original position of the list item we want to move
     * @param {integer} newIndex - new position of the item we want to move
     */
    addMoveItemTransaction = (oldIndex, newIndex) => {
        let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
        // Add transaction to transaction stack
        this.tps.addTransaction(transaction);

        // tps.addTransaction calls doTransaction() -> updates state of this.tps

        // this.loadlist updates the state of the list. Re-render occurs AFTER this.tps
        // has finished it's operations
        this.loadList(this.state.currentList.key);
    }

    /**
     * Updates the text at the given position in the current list with the given
     * text. 
     * 
     * NOTE: Should only be called by @method addChangeItemTransaction
     * 
     * @param {*} index the index of the item in the currentList
     * @param {*} newText the text we want to update the given index with
     */
    updateCurrentListItem = (index, newText) => {

        // Creates copy of currentlist
        let newList = this.state.currentList

        // Replaces item at given index with new text data
        newList.items[index] = newText

        // Update the database with the new list
        this.db.mutationUpdateList(newList);
    }

    /**
     * Moves the item the position of oldIndex in the current list to the position of 
     * newIndex in the current list.
     * 
     * NOTE: Should only be called by @method addMoveItemTransaction
     * 
     * @param {*} newIndex the new index to move the item to
     * @param {*} oldIndex the old index to move the item from
     */
    swapCurrentListItems = (newIndex, oldIndex) => {
        let newList = this.state.currentList;
        let newItems = newList.items;

        // Handles the swaping of the items in the list
        newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]);

        // Set the items in the new list
        newList.items = newItems;

        // Update database with new list
        this.db.mutationUpdateList(newList);

        // Set state to the new list -> triggers the rendering of workspace with new list
        // this.setState(prevState => ({
        //     currentList: newList,
        //     sessionData: prevState.sessionData
        // }));
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal = (keyNamePair) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: prevState.sessionData,
            deleteListKeyNamePair: keyNamePair
        }));
    }

    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal = () => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: prevState.sessionData,
            deleteListKeyNamePair: null
        }))
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    isCurrentListOpen={this.state.currentList !== null}
                    closeCallback={this.closeCurrentList} 
                    jstps={this.tps}
                    redoCallback={this.redo}
                    undoCallback={this.undo}
                />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    addChangeItemCallback={this.addChangeItemTransaction}
                    addMoveItemCallback={this.addMoveItemTransaction}
                />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    deleteListKeyNamePair={this.state.deleteListKeyNamePair}
                    removeListCallback={this.removeList}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                />
                <ControlModal
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                />
            </div>
        );
    }
}

export default App;
