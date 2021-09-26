import React from 'react';

export default class ControlModal extends React.Component {

    handleKeyPress = (event) => {
        
        if (event.ctrlKey && event.key === 'z') {
            this.props.undoCallback();
        }

        if (event.ctrlKey && event.key === 'y') {
            this.props.redoCallback();
        }
    }

    componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyPress);
    }

    render() {
        return (
            <div 
                id="control-modal" 
                className="modal"
            ></div>);
    }
}