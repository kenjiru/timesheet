import * as React from "react";
import { Input, Button, Glyphicon } from "react-bootstrap";

import "./EditableText.less";

class EditableText extends React.Component<IEditableTextProps, IEditableTextState> {
    constructor(props: IEditableTextProps) {
        super(props);

        this.state = {
            showEdit: false,
            value: props.value
        };
    }

    /* tslint:disable:no-string-literal */
    public componentDidUpdate(): void {
        if (this.state.showEdit) {
            let inputComponent: any = this.refs["editInput"];

            inputComponent.refs["input"].focus();
        }
    }
    /* tslint:enable:no-string-literal */

    public render(): React.ReactElement<any> {
        return (
            <div className="editable-text">
                {this.renderContent()}
            </div>
        );
    }

    private renderContent(): React.ReactElement<any> {
        if (this.state.showEdit) {
            return this.renderEdit();
        } else {
            return this.renderText();
        }
    }

    private renderText(): React.ReactElement<any> {
        return (
            <div className="text-container" onClick={this.handleClick.bind(this)}>
                {this.props.value}
            </div>
        );
    }

    private renderEdit(): React.ReactElement<any> {
        return (
            <div className="input-container">
                <Input ref="editInput" type="text" value={this.state.value} addonAfter={this.renderSaveButton()}
                       onChange={this.handleValueChange.bind(this)}
                       onKeyDown={this.handleKeyDown.bind(this)}/>
            </div>
        );
    }

    private renderSaveButton(): React.ReactElement<any> {
        return (
            <Button bsStyle="success" bsSize="xsmall" className="save" onClick={this.handleSaveChange.bind(this)}>
                <Glyphicon glyph="ok"/>
            </Button>
        );
    }

    private handleClick(): void {
        this.setState({
            showEdit: true
        });
    }

    private handleValueChange(ev: any): void {
        this.setState({
            value: ev.target.value
        });
    }

    private handleKeyDown(ev: React.KeyboardEvent): void {
        if (ev.keyCode === 13) { // handle Enter
            this.handleSaveChange();
        } else if (ev.keyCode === 27) { // handle Escape
            this.handleCancel();
        }
    }

    private handleSaveChange(): void {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(this.state.value);
        }

        this.setState({
            showEdit: false
        });
    }

    private handleCancel(): void {
        this.setState({
            value: this.props.value,
            showEdit: false
        });
    }
}

interface IEditableTextProps extends React.Props<EditableText> {
    value: string;
    onChange: (value: string) => void;
}

interface IEditableTextState {
    showEdit?: boolean;
    value?: string;
}

export default EditableText;
