import * as React from 'react';
import moment from "moment";
import { Grid, Row, Col, Panel, Button, Input, ButtonInput, Glyphicon } from "react-bootstrap";

import TagsManager from "../tags-manager/TagsManager";
import DatePicker from "../../widgets/date-picker/DatePicker";
import Callout from "../../widgets/callout/Callout";

import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import { IAction, addTask, addTaskTag, addBreak } from "../../model/actions";
import IdUtil from "../../utils/IdUtil";

class CreateTask extends React.Component<ICreateTaskProps, ICreateTaskState> {
    constructor(props:ICreateTaskProps) {
        super(props);

        this.state = {
            startDate: "18/02/2016",
            projectId: null,
            workingInterval: "08:30-12:30, 14:00-18:00",
            description: "Setting up the project",
            tagId: "office",
            showManageTags: false
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
                            {this.renderProjects()}
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
                        <Input type="select" label="Tags" placeholder="select"
                               value={this.state.tagId} addonBefore={<Glyphicon glyph="tags"/>}
                               onChange={this.handleTagsChange.bind(this)}>
                            <option value="none">none</option>
                            {this.renderTags()}
                        </Input>
                        <ButtonInput onClick={this.showManageTags.bind(this)}>Manage Tags</ButtonInput>
                    </Col>

                    <Col md={1} className="text-left">
                        <label className="control-label">&nbsp;</label>
                        <div>
                            <Button bsStyle="primary" onClick={this.handleAddClicked.bind(this)}>Add Task</Button>
                        </div>
                    </Col>
                </Row>

                {this.renderManageTags()}
            </Grid>
        )
    }

    renderManageTags() {
        if (this.state.showManageTags) {
            return <TagsManager tags={this.props.tags} onClose={this.hideManageTags.bind(this)}/>
        }
    }

    renderProjects() {
        return _.map(this.props.projects, (project:IProject) => (
            <option key={project.projectId} value={project.projectId}>{project.name}</option>
        ));
    }

    renderTags() {
        return _.map(this.props.tags, (tag:ITag) => (
            <option key={tag.tagId} value={tag.tagId}>{tag.name}</option>
        ));
    }

    showManageTags() {
        this.setState({
            showManageTags: true
        });
    }

    hideManageTags() {
        this.setState({
            showManageTags: false
        });
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
        let taskId = IdUtil.newId();

        let task:ITask = {
            taskId,
            projectId: state.projectId,
            startDate: taskInterval.startDate,
            endDate: taskInterval.endDate,
            description: state.description
        };

        let taskTag:ITaskTag = {
            id: IdUtil.newId(),
            taskId: taskId,
            tagId: state.tagId
        };

        let breaks:IBreak[] = this.computeBreaks(task.taskId);
        _.each(breaks, (breakItem:IBreak) => this.props.dispatch(addBreak(breakItem)));

        this.props.dispatch(addTaskTag(taskTag));
        this.props.dispatch(addTask(task));
    }

    computeBreaks(taskId):IBreak[] {
        let breaks:IBreak[] = [];

        let workingPeriods = this.computeWorkingPeriods();

        for (let i=0; i < workingPeriods.length - 1; i++) {
            breaks.push({
                breakId: IdUtil.newId(),
                taskId,
                startDate: this.state.startDate + " " + workingPeriods[i].endTime,
                endDate: this.state.startDate + " " + workingPeriods[i+1].startTime
            });
        }

        return breaks;
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
                startTime: periods[0].trim(),
                endTime: periods[1].trim()
            }
        });
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
    projects: IProject[],
    tags: ITag[],
    dispatch: (action) => void
}

interface ICreateTaskState {
    startDate?: string,
    projectId?: string,
    workingInterval?: string,
    description?: string,
    tagId?: string,
    showManageTags?: boolean
}

export default CreateTask;