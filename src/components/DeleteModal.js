import React, { Component } from 'react';

export default class DeleteModal extends Component {

    handleDeleteList = () => {
        this.props.removeListCallback(this.props.deleteListKeyNamePair);
    }


    render() {

        let name = "";
        let className = "modal";

        if (this.props.deleteListKeyNamePair !== null) {
            className = "modal is-visible";
            name = this.props.deleteListKeyNamePair.name;
        }

        return (
            <div
                className={className}
                id="delete-modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <header className="dialog-header">
                        Delete the {name} Top 5 List?
                    </header>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={this.handleDeleteList}
                        >Confirm</button>
                        <button
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={this.props.hideDeleteListModalCallback}
                        >Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}