import React from "react";
import EditItem from "./EditItem";

/**
 * Represents the items list of the currently selected top-5-list 
 * in the workspace. Contains the top-5-list items.
 * 
 * @author PeteyLumpkins
 */
export default class EditItems extends React.Component {

    render() {
        if (this.props.currentList === null) {
            return (<div id="edit-items"></div>);
        } else {

            let ids = [1, 2, 3, 4, 5];

            return (
            <div id="edit-items">
                {
                    ids.map((id) => (
                        <EditItem 
                            id={id} 
                            text={this.props.currentList.items[id - 1]}
                            updateCurrentListItemCallback={this.props.updateCurrentListItemCallback}
                            swapCurrentListItemCallback={this.props.swapCurrentListItemCallback}
                            handleDragOverCallback={this.handleDragOver}
                        />
                    ))
                }
            </div>
            );
        }
    }
}