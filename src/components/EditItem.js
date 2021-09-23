import React from 'react';

export default class EditItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
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

    }

    handleDragOver = (event) => {

    }

    render() {

        if (!this.state.isEditing) {
            return (
                <div 
                    id={"edit-item" + this.props.id} 
                    className="top5-item"
                    draggable={true}
                    onDoubleClick={this.handleDoubleClick}
                >
                    {this.props.text}
                </div>
            );
        } else {
            return (
                <input 
                    id={"edit-item" + this.props.id} 
                    className="top5-item"
                    type="text"
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={this.props.text}
                >   

                </input>
            );
        }
    }
}