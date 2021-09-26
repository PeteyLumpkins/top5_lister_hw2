import React from 'react';

/**
 * Represents the close button inside the edit toolbar. Can be used to close the
 * current lists edit window.
 * 
 * @author PeteyLumpkins
 */
export default class CloseButton extends React.Component {

    handleOnClick = () => {
        this.props.closeCallback()
    }

    render() {
        
        if (this.props.isCurrentListOpen) {
            return (
                <div
                    id='close-button'
                    className="top5-button"
                    onClick={this.handleOnClick}
                >&#x24E7;</div>
            );
        } else {
            return (
                <div
                    id="close-button"
                    className="top5-button disabled"
                >&#x24E7;</div>
            );
        }
    }
}