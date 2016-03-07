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
                <Row>
                    <Col xs={10}>
                        <Input type="text" bsSize="small" placeholder="Enter value" value={this.state.value}
                               onChange={this.handleValueChange.bind(this)}/>
                    </Col>
                    <Col xs={2} className="ok-button-container">
                        <Button bsStyle="success" bsSize="xsmall" className="save" onClick={this.handleSaveChange.bind(this)}>
                            <Glyphicon glyph="ok"/>
                        </Button>
                    </Col>
                </Row>
            </div>
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

    handleSaveChange() {
        if (typeof this.props.onChange == "function") {
            this.props.onChange(this.state.value);
        }

        this.setState({
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