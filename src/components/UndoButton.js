import React from 'react';

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