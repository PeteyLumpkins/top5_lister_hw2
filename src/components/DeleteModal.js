import React, { Component } from 'react';

export default class DeleteModal extends Component {
    render() {

        let name = "";

        let className = "modal";
        if (this.props.isVisible) {
            className = "modal is-visible"
        }

        if (this.props.listKeyPair) {
            name = this.props.listKeyPair.name;
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