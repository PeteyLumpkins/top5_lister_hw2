import React from "react";

import UndoButton from "./UndoButton.js";
import RedoButton from "./RedoButton.js";
import CloseButton from "./CloseButton.js";

export default class EditToolbar extends React.Component {
    render() {

        return (
            <div id="edit-toolbar">
                <UndoButton 
                    jstps={this.props.jstps}
                    undoCallback={this.props.undoCallback}
                />
                <RedoButton 
                    jstps={this.props.jstps}
                    redoCallback={this.props.redoCallback}
                />
                <CloseButton 
                    isCurrentListOpen={this.props.isCurrentListOpen}
                    closeCallback={this.props.closeCallback}
                />
            </div>
        )
    }
}