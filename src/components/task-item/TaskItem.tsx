import * as React from "react";
import moment from "moment";
import "moment-duration-format";
import { Row, Col, Collapse, Button } from "react-bootstrap";

import Callout from "../../widgets/callout/Callout";
import EditableText from "../../widgets/editable-text/EditableText";
import EditableSelect from "../../widgets/editable-select/EditableSelect";
import EditableMultiSelect from "../../widgets/editable-multi-select/EditableMultiSelect";
import store, { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import { updateTask, addTaskTag, removeTaskTag } from "../../model/actions";
import DateUtil, { ITimeInterval } from "../../utils/DateUtil";
import IdUtil from "../../utils/IdUtil";
import { IEntry } from "../../utils/CommonInterfaces";

import TaskBreaks from "./TaskBreaks";

import "./TaskItem.less";

class TaskItem extends React.Component<ITaskItemProps, ITaskItemState> {
    constructor(props: ITaskItemProps) {
        super(props);

        this.state = {
            showBreaks: false
        };
    }

    public render(): React.ReactElement<any> {
        let task: ITask = this.props.task;

        let bsStyle: string = this.props.isOdd ? "warning" : null;
        let buttonText: string = this.state.showBreaks ? "Hide Breaks" : "Show Breaks";

        let workDuration: moment.Duration = this.computeWorkDuration();
        let breakDuration: moment.Duration = this.computeBreakDuration();

        let availableTags: IEntry[] = _.map(this.props.tags, (tag: ITag) => ({
            id: tag.tagId,
            label: tag.name
        }));

        let selectedTags: IEntry[] = this.computeTaskTags();
        let selectedValue: string = _.map(selectedTags, (tagOption: IEntry) => tagOption.id).join(",");

        let taskInterval: string = DateUtil.extractTime(task.startDate) + " - " + DateUtil.extractTime(task.endDate);

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
        );
    }

    private renderBreaks(): React.ReactElement<any> {
        return (
            <Collapse in={this.state.showBreaks}>
                <div>
                    <TaskBreaks breaks={this.props.breaks}/>
                </div>
            </Collapse>
        );
    }

    private handleShowBreaks(): void {
        this.setState({
            showBreaks: !this.state.showBreaks
        });
    }

    private handleTaskIntervalChange(intervalStr: string): void {
        let task: ITask = _.clone(this.props.task);
        let taskInterval: ITimeInterval = DateUtil.computeTimeInterval(intervalStr);

        let startDate: string = DateUtil.extractDate(task.startDate) + " " + taskInterval.startTime;
        let endDate: string = DateUtil.extractDate(task.endDate) + " " + taskInterval.endTime;

        task.startDate = DateUtil.getDateTime(startDate);
        task.endDate = DateUtil.getDateTime(endDate);

        this.updateStore(task);
    }

    private handleDescriptionChange(newDescription: string): void {
        let task: ITask = _.clone(this.props.task);
        task.description = newDescription;

        this.updateStore(task);
    }

    private handleProjectChange(newProjectId: string): void {
        let task: ITask = _.clone(this.props.task);
        task.projectId = newProjectId;

        this.updateStore(task);
    }

    private handleTagsChange(value: string): void {
        let oldTags: string[] = this.computeTagIds();
        let newTags: string[] = value.split(",");

        let tagsToAdd: string[] = _.difference(newTags, oldTags);
        let tagsToDelete: string[] = _.difference(oldTags, newTags);

        let taskId: string = this.props.task.taskId;

        _.each(tagsToDelete, (tagId: string) => store.dispatch(removeTaskTag({
            id: "not-needed",
            taskId,
            tagId,
            deleted: null,
            lastUpdate: null
        })));

        _.each(tagsToAdd, (tagId: string) => store.dispatch(addTaskTag({
            id: IdUtil.newId(),
            taskId,
            tagId,
            deleted: false,
            lastUpdate: null
        })));
    }

    private updateStore(newTask: ITask): void {
        store.dispatch(updateTask(newTask));
    }

    private computeProjectValues(): IEntry[] {
        return _.map(this.props.projects, (project: IProject) => ({
            id: project.projectId,
            label: project.name
        }));
    }

    private computeTaskTags(): IEntry[] {
        let tagIds: string[] = this.computeTagIds();
        let tags: ITag[] = _.filter(this.props.tags, (tag: ITag) => {
            return _.indexOf(tagIds, tag.tagId) !== -1;
        });

        return _.map(tags, (tag: ITag) => ({
            id: tag.tagId,
            label: tag.name
        }));
    }

    private computeTagIds(): string[] {
        let taskId: string = this.props.task.taskId;
        let taskTags: ITaskTag[] = _.filter(this.props.taskTags, {taskId: taskId});

        return _.map(taskTags, (taskTag: ITaskTag) => taskTag.tagId);
    }

    private computeWorkDuration(): moment.Duration {
        let task: ITask = this.props.task;
        let workDuration: moment.Duration = DateUtil.computeDuration(task);
        let breakDuration: moment.Duration = this.computeBreakDuration();

        return workDuration.subtract(breakDuration);
    }

    private computeBreakDuration(): moment.Duration {
        return DateUtil.computeTotalDuration(this.props.breaks);
    }
}

interface ITaskItemProps extends React.Props<TaskItem> {
    task: ITask;
    projects: IProject[];
    tags: ITag[];
    taskTags: ITaskTag[];
    breaks: IBreak[]; // this refers only to the breaks for this task
    isOdd: boolean;
}
interface ITaskItemState {
    showBreaks?: boolean;
}

export default TaskItem;
