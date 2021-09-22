import React from "react";
import EditItem from "./EditItem";

export default class EditItems extends React.Component {

    render() {
        if (this.props.currentList === null) {
            return (<div id="edit-items"></div>);
        } else {

            let ids = [1, 2, 3, 4, 5];

            return (
            <div id="edit-items">
                {
                    ids.map((id) => (
                        <EditItem 
                        id={id} 
                        text={this.props.currentList.items[id - 1]}
                        />
                    ))
                }
            </div>
            );
        }
    }
}