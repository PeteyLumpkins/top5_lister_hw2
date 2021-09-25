import jsTPS_Transaction from "../../jstps/jsTPS.js";
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author PeteyLumpkins
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(initApp, initOld, initNew) {
        super();
        this.app = initApp;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        this.app.moveItem(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.app.moveItem(this.newItemIndex, this.oldItemIndex);
    }
}