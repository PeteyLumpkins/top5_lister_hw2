import React from 'react';

/**
 * Represents one of the items in our top-5-list while we
 * are editing it in the workspace.
 * 
 * @author PeteyLumpkins
 */
export default class EditItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            isDraggingOver: false
        }
    }

    handleDoubleClick = (event) => {
        this.handleToggleEdit();
    }

    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur(event);
        }
    }

    handleToggleEdit = () => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    handleBlur = (event) => {
        this.props.updateCurrentListItemCallback(this.props.id - 1, event.target.value);
        this.handleToggleEdit();
    }

    handleDragStart = (event) => {
        // Set oldIndex of the start item
        event.dataTransfer.setData("oldIndex", this.props.id - 1);
    }

    handleDragOver = (event) => {
        event.preventDefault();
        // Set state of item so it's being dragged over
        this.setState({isDraggingOver: true});
    }

    handleDragLeave = (event) => {
        // Set state of item when it's no longer being dragged over
        this.setState({isDraggingOver: false});
    }

    handleDragDrop = (event) => {
        event.preventDefault()

        // Turn off the highlighting
        this.handleDragLeave();

        // Change positions of items in the currentList 
        this.props.swapCurrentListItemCallback(this.props.id - 1, event.dataTransfer.getData("oldIndex"));
    }

    render() {
        if (this.state.isEditing) {
            return (
                <input 
                    id={"edit-item-" + this.props.id} 
                    className="top5-item"
                    type="text"
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={this.props.text}
                >   
                </input>
            );
        } else {

            // If items is being hovered over -> we adjust classname -> set it to green
            let className = "top5-item"
            if (this.state.isDraggingOver) {
                className = "top5-item-dragged-to"
            }

            return (
                <div 
                    id={"edit-item" + this.props.id} 
                    className={className}
                    draggable={true}
                    onDoubleClick={this.handleDoubleClick}

                    onDragStart={this.handleDragStart}
                    onDragOver={this.handleDragOver}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDragDrop}
                >   
                    {this.props.text}
                </div>
            );
        }
    }
}