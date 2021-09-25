import React from "react";
import EditItems from "./EditItems";

export default class Workspace extends React.Component {
    
    render() {
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <EditItems 
                        currentList={this.props.currentList}
                        addChangeItemCallback={this.props.addChangeItemCallback}
                        addMoveItemCallback={this.props.addMoveItemCallback}
                    />
                </div>
            </div>
        )
    }
}