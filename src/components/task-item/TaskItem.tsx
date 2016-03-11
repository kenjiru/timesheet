import * as React from "react";
import * as ReactDOM from "react-dom";
import moment from "moment";
import "moment-duration-format";
import { Grid, Row, Col, Collapse, Button } from "react-bootstrap";

import Callout from "../../widgets/callout/Callout";
import EditableText from "../../widgets/editable-text/EditableText";
import EditableSelect from "../../widgets/editable-select/EditableSelect";
import EditableMultiSelect from "../../widgets/editable-multi-select/EditableMultiSelect";
import store, { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import { updateTask, addTaskTag, removeTaskTag } from "../../model/actions";
import DateUtil, { ITimeInterval } from "../../utils/DateUtil";
import IdUtil from "../../utils/IdUtil";
import { IEntry, IOption } from "../../utils/CommonInterfaces";

import TaskBreaks from "./TaskBreaks";

import "./TaskItem.less";
import {removeTag} from "../../model/actions";

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

        let availableTags:IEntry[] = _.map(this.props.tags, (tag:ITag) => ({
            id: tag.tagId,
            label: tag.name
        }));

        let selectedTags:IEntry[] = this.computeTaskTags();
        let selectedValue = _.map(selectedTags, tagOption => tagOption.id).join(",");

        let taskInterval = DateUtil.extractTime(task.startDate) + " - " + DateUtil.extractTime(task.endDate);

        return (
            <Callout key={task.taskId} bsStyle={bsStyle} className="task-item">
                <Row>
                    <Col xs={3} md={2}>
                        <EditableText value={taskInterval} onChange={this.handleTaskIntervalChange.bind(this)}/>
                        <div>
                            <Button className="show-hide-button" bsSize="xsmall"
                                    onClick={this.handleShowBreaks.bind(this)}>{buttonText}</Button>
                        </div>
                    </Col>
                    <Col xs={5} md={6}>
                        <EditableSelect selectedValue={task.projectId} availableValues={this.computeProjectValues()}
                                        onChange={this.handleProjectChange.bind(this)} iconId="folder-open"/>
                        <EditableText value={task.description} onChange={this.handleDescriptionChange.bind(this)}/>
                    </Col>
                    <Col xs={2} md={2}>
                        <EditableMultiSelect selectedValue={selectedValue} availableValues={availableTags}
                                             onChange={this.handleTagsChange.bind(this)} iconId="tags"/>
                    </Col>
                    <Col xs={2} md={2} className="text-right">
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

    handleProjectChange(newProjectId:string) {
        let task:ITask = _.clone(this.props.task);
        task.projectId = newProjectId;

        this.updateStore(task);
    }

    handleTagsChange(value:string) {
        let oldTags = this.computeTagIds();
        let newTags = value.split(",");

        let tagsToAdd = _.difference(newTags, oldTags);
        let tagsToDelete = _.difference(oldTags, newTags);

        let taskId = this.props.task.taskId;

        _.each(tagsToDelete, tagId => store.dispatch(removeTaskTag({
            id: "not-needed",
            taskId,
            tagId
        })));

        _.each(tagsToAdd, tagId => store.dispatch(addTaskTag({
            id: IdUtil.newId(),
            taskId,
            tagId
        })));
    }

    updateStore(newTask:ITask) {
        store.dispatch(updateTask(newTask));
    }

    computeProjectValues():IEntry[] {
        return _.map(this.props.projects, (project:IProject) => ({
            id: project.projectId,
            label: project.name
        }));
    }

    computeTaskTags():IEntry[] {
        let tagIds = this.computeTagIds();
        let tags = _.filter(this.props.tags, (tag:ITag) => {
            return _.indexOf(tagIds, tag.tagId) != -1;
        });

        return _.map(tags, (tag:ITag) => ({
            id: tag.tagId,
            label: tag.name
        }));
    }

    computeTagIds():string[] {
        let taskId = this.props.task.taskId;
        let taskTags = _.filter(this.props.taskTags, {taskId: taskId});

        return _.map(taskTags, (taskTag:ITaskTag) => taskTag.tagId);
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