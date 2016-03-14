import * as React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import Select from "react-select";

import { IEntry, IOption } from "../../utils/CommonInterfaces";

import "./EditableMultiSelect.less";

class EditableMultiSelect extends React.Component<IEditableMultiSelectProps, IEditableMultiSelectState> {
    constructor(props: IEditableMultiSelectProps) {
        super(props);

        this.state = {
            showEdit: false,
            selectedValue: props.selectedValue
        };
    }

    /* tslint:disable:no-string-literal */
    public componentDidUpdate(): void {
        if (this.state.showEdit) {
            let selectComponent: any = this.refs["select"];

            selectComponent.focus();
        }
    }
    /* tslint:enable:no-string-literal */

    public render(): React.ReactElement<any> {
        return (
            <div className="editable-multi-select">
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
        let selectedEntryIds: string[] = this.props.selectedValue.split(",");
        let selectedEntries: IEntry[] = _.filter(this.props.availableValues, (entry: IEntry) => {
            return _.indexOf(selectedEntryIds, entry.id) !== -1;
        });

        let text: string = "";
        if (selectedEntries) {
            text = _.map(selectedEntries, (entry: IEntry) => entry.label).join(", ");
        }

        return (
            <div className="text-container" onClick={this.handleClick.bind(this)}>{text}</div>
        );
    }

    private renderEdit(): React.ReactElement<any> {
        return (
            <div className="select-container input-group">
                {this.renderGlyph()}
                <Select ref="select" value={this.state.selectedValue} options={this.computeOptions()} multi={true}
                        onChange={this.handleValueChange.bind(this)}/>
                {this.renderSaveButton()}
            </div>
        );
    }

    private renderGlyph(): React.ReactElement<any> {
        if (this.props.iconId) {
            return (
                <span className="input-group-addon">
                    <Glyphicon glyph={this.props.iconId}/>
                </span>
            );
        }
    }

    private renderSaveButton(): React.ReactElement<any> {
        return (
            <span className="input-group-addon">
                <Button bsStyle="success" bsSize="xsmall" className="save" onClick={this.handleSave.bind(this)}>
                    <Glyphicon glyph="ok"/>
                </Button>
            </span>
        );
    }

    private handleClick(): void {
        this.setState({
            showEdit: true
        });
    }

    private handleValueChange(selectedValues: IOption[]): void {
        let value: string = _.map(selectedValues, (selectedValue: IOption) => selectedValue.value).join(",");

        this.setState({
            selectedValue: value
        });
    }

    private handleSave(): void {
        console.log("handleSaveChange");
        if (typeof this.props.onChange === "function") {
            this.props.onChange(this.state.selectedValue);
        }

        this.setState({
            showEdit: false
        });
    }

    private computeOptions(): any[] {
        return _.map(this.props.availableValues, (availableValue: IEntry) => ({
            value: availableValue.id,
            label: availableValue.label
        }));
    }
}

interface IEditableMultiSelectProps extends React.Props<EditableMultiSelect> {
    availableValues: IEntry[];
    selectedValue: string;
    onChange: (value: string) => void;
    iconId?: string;
}

interface IEditableMultiSelectState {
    showEdit?: boolean;
    selectedValue?: string;
}

export default EditableMultiSelect;
