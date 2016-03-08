import * as React from "react";
import * as ReactDOM from "react-dom";
import moment from "moment";
import "moment-duration-format";
import { Grid, Row, Col, Collapse, Button } from "react-bootstrap";

import Callout from "../../widgets/callout/Callout";
import EditableText from "../../widgets/editable-text/EditableText";
import store, { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import { updateTask } from "../../model/actions";
import DateUtil, { ITimeInterval } from "../../utils/DateUtil";

import TaskBreaks from "./TaskBreaks";

import "./TaskItem.less";

class TaskItem extends React.Component<ITaskItemProps, ITaskItemState> {
    constructor(props:ITaskItemProps) {
        super(props);

        this.state = {
            showBreaks: false
        };
    }

    render() {
        let task:ITask = this.props.task;

        let bsStyle = this.props.isOdd ? "warning" : null;
        let buttonText = this.state.showBreaks ? "Hide Breaks" : "Show Breaks";

        let workDuration = this.computeWorkDuration();
        let breakDuration = this.computeBreakDuration();

        let tagsString = this.computeTaskTags(task.taskId);
        let projectName = this.computeProjectName(task.projectId);

        let taskInterval = DateUtil.extractTime(task.startDate) + " - " + DateUtil.extractTime(task.endDate);

        return (
            <Callout key={task.taskId} bsStyle={bsStyle} className="task-item">
                <Row>
                    <Col md={2}>
                        <div>
                            <EditableText value={taskInterval} onChange={this.handleTaskIntervalChange.bind(this)}/>
                        </div>
                        <div>
                            <Button className="show-hide-button" bsSize="xsmall"
                                    onClick={this.handleShowBreaks.bind(this)}>{buttonText}</Button>
                        </div>
                    </Col>
                    <Col md={7}>
                        <div>{projectName}</div>
                        <div>
                            <EditableText value={task.description} onChange={this.handleDescriptionChange.bind(this)}/>
                        </div>
                    </Col>
                    <Col md={1}>
                        <div>{tagsString}</div>
                    </Col>
                    <Col md={2} className="text-right">
                        <div>{DateUtil.formatDuration(workDuration)}</div>
                        <div>{DateUtil.formatDuration(breakDuration)}</div>
                    </Col>
                </Row>

                {this.renderBreaks()}
            </Callout>
        )
    }

    renderBreaks() {
        return (
            <Collapse in={this.state.showBreaks}>
                <div>
                    <TaskBreaks breaks={this.props.breaks}/>
                </div>
            </Collapse>
        )
    }

    handleShowBreaks() {
        this.setState({
            showBreaks: !this.state.showBreaks
        });
    }

    handleTaskIntervalChange(intervalStr: string) {
        let task:ITask = _.clone(this.props.task);
        let taskInterval:ITimeInterval = DateUtil.computeTimeInterval(intervalStr);

        task.startDate = DateUtil.extractDate(task.startDate) + " " + taskInterval.startTime;
        task.endDate = DateUtil.extractDate(task.endDate) + " " + taskInterval.endTime;

        this.updateStore(task);
    }

    handleDescriptionChange(newDescription: string) {
        let task:ITask = _.clone(this.props.task);
        task.description = newDescription;

        this.updateStore(task);
    }

    updateStore(newTask:ITask) {
        store.dispatch(updateTask(newTask));
    }

    computeTaskTags(taskId:string):string {
        let taskTags = _.filter(this.props.taskTags, {taskId: taskId});
        let tagIds = _.map(taskTags, (taskTag:ITaskTag) => taskTag.tagId);
        let tags = _.filter(this.props.tags, (tag:ITag) => {
            return _.indexOf(tagIds, tag.tagId) != -1;
        });

        return _.map(tags, (tag:ITag) => tag.name).join(",");
    }

    computeProjectName(projectId:string):string {
        let project:IProject = _.find(this.props.projects, {projectId});

        if (project) {
            return project.name;
        }
    }

    computeWorkDuration():moment.Duration {
        let task = this.props.task;
        let workDuration = DateUtil.computeDuration(task);
        let breakDuration = this.computeBreakDuration();

        return workDuration.subtract(breakDuration);
    }

    computeBreakDuration():moment.Duration {
        return DateUtil.computeTotalDuration(this.props.breaks);
    }
}

interface ITaskItemProps extends React.Props<TaskItem> {
    task: ITask,
    projects: IProject[],
    tags: ITag[],
    taskTags: ITaskTag[],
    breaks: IBreak[], // this refers only to the breaks for this task
    isOdd: boolean
}
interface ITaskItemState {
    showBreaks?: boolean
}

export default TaskItem;