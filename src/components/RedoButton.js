import React from "react"

/**
 * Represents the redo button inside the edit toolbar. Can be
 * used to redo a previously undone transaction. If there are no operations to 
 * redo then the button should be disabled.
 * 
 * @author PeteyLumpkins
 */
export default class RedoButton extends React.Component {

    handleOnClick = () => {
        this.props.redoCallback();
    }

    render() {

        if (this.props.jstps.hasTransactionToRedo() && this.props.currentList !== null) {
            return (
                <div
                    id='redo-button'
                    className="top5-button"
                    onClick={this.handleOnClick}
                >&#x21B7;</div>
            )
        } else {
            return (
                <div
                    id='redo-button'
                    className="top5-button disabled"
                >&#x21B7;</div>
            )
        }
    }
}