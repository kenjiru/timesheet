import * as React from 'react';
import moment from "moment";
import { Grid, Row, Col, Panel, Button, Input, Glyphicon } from "react-bootstrap";

import DatePicker from "../../widgets/date-picker/DatePicker";
import Callout from "../../widgets/callout/Callout";

import { ITask } from "../../model/store";
import { addNewTask, IAction } from "../../model/actions";

class CreateTask extends React.Component<ICreateTaskProps, ICreateTaskState> {
    constructor(props:ICreateTaskProps) {
        super(props);

        this.state = {
            startDate: "18/02/2016",
            projectId: "control-panel",
            workingInterval: "08:30-12:30, 14:00-18:00",
            description: "Setting up the project",
            tagId: "office"
        };
    }

    render() {
        return (
            <Grid className="create-task" fluid={true}>
                <Row>
                    <Col md={2}>
                        <DatePicker onChange={this.handleStartDateChanged.bind(this)}>
                            <Input type="text" label="Start date" placeholder="Start date" help="Format: 18/02/2016"
                                   value={this.state.startDate} readOnly addonBefore={<Glyphicon glyph="calendar"/>}/>
                        </DatePicker>
                    </Col>

                    <Col md={2}>
                        <Input type="select" label="Project" placeholder="select" value={this.state.projectId}
                               onChange={this.handleProjectChanged.bind(this)}
                               addonBefore={<Glyphicon glyph="folder-open"/>}>
                            <option value="none">none</option>
                            <option value="control-panel">Control Panel</option>
                            <option value="private">Private</option>
                        </Input>
                    </Col>

                    <Col md={3}>
                        <Input type="text" label="Working intervals" placeholder="Enter text here"
                               help="Example 08:30-12:30, 14:00-18:00" addonBefore={<Glyphicon glyph="time"/>}
                               hasFeedback value={this.state.workingInterval}
                               onChange={this.handleWorkingIntervalChange.bind(this)}/>
                    </Col>

                    <Col md={3}>
                        <Input type="text" label="Task description" placeholder="Enter description here" help=""
                               value={this.state.description} addonBefore={<Glyphicon glyph="pencil"/>} hasFeedback
                               onChange={this.handleTaskDescriptionChange.bind(this)}/>
                    </Col>

                    <Col md={1}>
                        <Input type="select" label="Tags" placeholder="select" help="Identifies the location"
                               value={this.state.tagId} addonBefore={<Glyphicon glyph="tags"/>}
                               onChange={this.handleTagsChange.bind(this)}>
                            <option value="none">none</option>
                            <option value="office">Office</option>
                            <option value="home">Home</option>
                        </Input>
                    </Col>

                    <Col md={1} className="text-left">
                        <label className="control-label">&nbsp;</label>
                        <div>
                            <Button bsStyle="primary" onClick={this.handleAddClicked.bind(this)}>Add Task</Button>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }

    handleStartDateChanged(date:Date) {
        let dateStr = moment(date).format("DD-MM-YYYY");

        this.setState({
            startDate: dateStr
        });
    }

    handleProjectChanged(ev) {
        this.setState({
            projectId: ev.target.value
        });
    }

    handleWorkingIntervalChange(ev) {
        this.setState({
            workingInterval: ev.target.value
        });
    }

    handleTaskDescriptionChange(ev) {
        this.setState({
            description: ev.target.value
        });
    }

    handleTagsChange(ev) {
        this.setState({
            tagId: ev.target.value
        });
    }

    handleAddClicked() {
        let state = this.state;
        let taskInterval = this.computeTaskInterval();

        let task:ITask = {
            id: this.generateNewId(),
            projectId: state.projectId,
            startDate: taskInterval.startDate,
            endDate: taskInterval.endDate,
            description: state.description,
            tagIds: [ state.tagId ]
        };

        this.props.dispatch(addNewTask(task));
    }

    computeTaskInterval():IDateInterval {
        let workingPeriods = this.computeWorkingPeriods();
        let startDate = this.state.startDate + " " + workingPeriods[0].startTime;
        let endDate = this.state.startDate + " " + workingPeriods[workingPeriods.length - 1].endTime;

        return {
            startDate,
            endDate
        }
    }

    computeWorkingPeriods():ITimeInterval[] {
        let workingIntervals = this.state.workingInterval.split(",");

        return _.map(workingIntervals, (interval:string) => {
            let periods = interval.split("-");

            return {
                startTime: periods[0],
                endTime: periods[1]
            }
        });
    }

    generateNewId():string {
        return "id-" + Math.random();
    }
}

interface ITimeInterval {
    startTime: string,
    endTime: string
}

interface IDateInterval {
    startDate: string,
    endDate: string
}

interface ICreateTaskProps {
    dispatch: (action) => void
    //onTaskCreated?: (task:ITask) => void
}

interface ICreateTaskState {
    startDate?: string,
    projectId?: string,
    workingInterval?: string,
    description?: string,
    tagId?: string
}

export default CreateTask;