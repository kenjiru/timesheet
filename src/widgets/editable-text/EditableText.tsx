import * as React from "react";
import { Row, Col, Input, Button, ButtonInput, Glyphicon } from "react-bootstrap";

import "./EditableText.less";

class EditableText extends React.Component<IEditableTextProps, IEditableTextState> {
    constructor(props:IEditableTextProps) {
        super(props);

        this.state = {
            showEdit: false,
            value: props.value
        };
    }

    componentDidUpdate() {
        if (this.state.showEdit) {
            let inputComponent:any = this.refs["editInput"];

            inputComponent.refs["input"].focus();
        }
    }

    render() {
        return (
            <div className="editable-text">
                {this.renderContent()}
            </div>
        )
    }

    renderContent() {
        if (this.state.showEdit) {
            return this.renderEdit();
        } else {
            return this.renderText();
        }
    }

    renderText() {
        return (
            <div className="text-container" onClick={this.handleClick.bind(this)}>
                {this.props.value}
            </div>
        )
    }

    renderEdit() {
        return (
            <div className="input-container">
                <Input ref="editInput" type="text" value={this.state.value} addonAfter={this.renderSaveButton()}
                       onChange={this.handleValueChange.bind(this)}
                       onKeyDown={this.handleKeyDown.bind(this)}/>
            </div>
        )
    }

    renderSaveButton() {
        return (
            <Button bsStyle="success" bsSize="xsmall" className="save" onClick={this.handleSaveChange.bind(this)}>
                <Glyphicon glyph="ok"/>
            </Button>
        )
    }

    handleClick() {
        this.setState({
            showEdit: true
        });
    }

    handleValueChange(ev) {
        this.setState({
            value: ev.target.value
        });
    }

    handleKeyDown(ev:React.KeyboardEvent) {
        if (ev.keyCode == 13) { // handle Enter
            this.handleSaveChange();
        } else if (ev.keyCode == 27) { // handle Escape
            this.handleCancel();
        }
    }

    handleSaveChange() {
        if (typeof this.props.onChange == "function") {
            this.props.onChange(this.state.value);
        }

        this.setState({
            showEdit: false
        });
    }

    handleCancel() {
        this.setState({
            value: this.props.value,
            showEdit: false
        });
    }
}

interface IEditableTextProps extends React.Props<EditableText> {
    value: string,
    onChange: (value:string) => void
}

interface IEditableTextState {
    showEdit?: boolean,
    value?: string
}

export default EditableText;