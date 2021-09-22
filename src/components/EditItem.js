import React from 'react';

export default class EditItem extends React.Component {
    
    render() {
        return (
            <div id={"edit-item" + this.props.id} className="top5-item">
                {this.props.text}
            </div>
        )
    }
}