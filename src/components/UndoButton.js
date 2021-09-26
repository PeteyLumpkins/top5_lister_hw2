import React from 'react';

/**
 * Represents the undo button in the edit toolbar component. When pressed will
 * undo a drag/drop or edit to the current list being edited. 
 * 
 * If there is no list being edited or there are no operations to undo then the 
 * button should be disabled.
 * 
 * @author PeteyLumpkins
 */
export default class UndoButton extends React.Component {

    
    handleOnClick = () => {
        this.props.undoCallback();
    }

    render() {

        if (this.props.jstps.hasTransactionToUndo()) {
            return (
                <div 
                    id='undo-button' 
                    className='top5-button'
                    onClick={this.handleOnClick}
                >&#x21B6;</div>
            )
        } else {
            return (
                <div
                    id='undo-button'
                    className='top5-button disabled'
                >&#x21B6;</div>
            )
        }
    }
}