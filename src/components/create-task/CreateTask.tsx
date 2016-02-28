import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, Row, Col, Panel, Button, Input, Glyphicon } from "react-bootstrap";

import DatePicker from "../../widgets/date-picker/DatePicker";
import Callout from "../../widgets/callout/Callout";

class CreateTask extends React.Component<ICreateTaskProps, ICreateTaskState> {
    constructor(props:ICreateTaskProps) {
        super(props);

        this.state = {
            workingInterval: null,
            taskDescription: null
        };
    }

    render() {
        return (
            <Grid className="create-task" fluid={true}>
                <Row>
                    <Col md={2}>
                        <DatePicker>
                            <Input type="text" label="Start date" placeholder="Start date" help="Format: 18.02.2016"
                                   addonBefore={<Glyphicon glyph="calendar"/>}/>
                        </DatePicker>
                    </Col>

                    <Col md={3}>
                        <Input ref="workingInterval" type="text" label="Working intervals"
                               placeholder="Enter text here" help="Example 08:30-12:30, 14:00-18:00"
                               addonBefore={<Glyphicon glyph="time"/>} hasFeedback value={this.state.workingInterval}
                               onChange={this.handleWorkingIntervalChange.bind(this)}
                               bsStyle={this.getWorkingIntervalClass()}/>
                    </Col>

                    <Col md={4}>
                        <Input ref="taskDescription" type="text" label="Task description"
                               placeholder="Enter description here" help=""
                               addonBefore={<Glyphicon glyph="pencil"/>} hasFeedback value={this.state.taskDescription}/>
                    </Col>

                    <Col md={2}>
                        <Input type="select" label="Tags" placeholder="select" help="Identifies the location"
                               addonBefore={<Glyphicon glyph="tags"/>}>
                            <option value="none">none</option>
                            <option value="office">Office</option>
                            <option value="home">Home</option>
                        </Input>
                    </Col>

                    <Col md={1} className="text-left">
                        <label className="control-label">&nbsp;</label>
                        <div>
                            <Button bsStyle="primary">Add Task</Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        {this.renderPanel()}
                    </Col>
                </Row>
            </Grid>
        )
    }

    renderPanel() {
        return (
            <Panel header={this.renderPanelHeader()}>
                <Row>
                    <Col md={2}>08:30 - 18:30</Col>
                    <Col md={8}>
                        <div>React Control Panel</div>
                        <div>Sprint review</div>
                    </Col>
                    <Col md={2} className="text-right">
                        <div>09h 07m</div>
                        <div>00h 15m</div>
                    </Col>
                </Row>
            </Panel>
        )
    }

    renderPanelHeader() {
        return (
            <Row>
                <Col md={6}>Fri, Feb 26</Col>
                <Col md={6} className="text-right">10h 47m</Col>
            </Row>
        )
    }

    getWorkingIntervalClass():string {
        return;
    }

    handleWorkingIntervalChange() {

    }
}

interface ICreateTaskProps {}

interface ICreateTaskState {
    workingInterval?: string,
    taskDescription?: string
}

export default CreateTask;