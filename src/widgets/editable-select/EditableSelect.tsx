import * as React from "react";
import { Row, Col, Input, Button, Glyphicon } from "react-bootstrap";

import { IEntry } from "../../utils/CommonInterfaces";

import "./EditableSelect.less";

class EditableSelect extends React.Component<IEditableSelectProps, IEditableSelectState> {
    constructor(props:IEditableSelectProps) {
        super(props);

        this.state = {
            showEdit: false,
            selectedValue: props.selectedValue
        };
    }

    componentDidUpdate() {
        if (this.state.showEdit) {
            let inputComponent:any = this.refs["selectInput"];

            inputComponent.refs["input"].focus();
        }
    }

    render() {
        return (
            <div className="editable-select">
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
        let selectedEntry:IEntry = _.find(this.props.availableValues, (entry:IEntry) => (
            entry.id == this.props.selectedValue
        ));

        let text:string = "";
        if (selectedEntry) {
            text = selectedEntry.label;
        }

        return (
            <div className="text-container" onClick={this.handleClick.bind(this)}>{text}</div>
        )
    }

    renderEdit() {
        return (
            <div className="select-container">
                <Input ref="selectInput" type="select" value={this.state.selectedValue}
                       onChange={this.handleValueChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}
                       addonBefore={this.renderGlyph()} addonAfter={this.renderSaveButton()}>

                    <option value="none">none</option>
                    {this.renderValues()}
                </Input>
            </div>
        )
    }

    renderGlyph() {
        if (this.props.iconId) {
            return <Glyphicon glyph={this.props.iconId}/>
        }
    }

    renderValues() {
        return _.map(this.props.availableValues, (entry:IEntry) => (
            <option key={entry.id} value={entry.id}>{entry.label}</option>
        ));
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
            selectedValue: ev.target.value
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
            this.props.onChange(this.state.selectedValue);
        }

        this.setState({
            showEdit: false
        });
    }

    handleCancel() {
        this.setState({
            selectedValue: this.props.selectedValue,
            showEdit: false
        });
    }
}

interface IEditableSelectProps extends React.Props<EditableSelect> {
    availableValues: IEntry[],
    selectedValue: string,
    onChange: (value:string) => void,
    iconId?: string
}

interface IEditableSelectState {
    showEdit?: boolean,
    selectedValue?: string
}

export default EditableSelect;