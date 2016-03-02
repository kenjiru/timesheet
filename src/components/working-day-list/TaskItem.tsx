import * as React from "react";
import * as ReactDOM from "react-dom";
import moment from "moment";
import "moment-duration-format";
import { Grid, Row, Col, Panel, Collapse, ListGroup, ListGroupItem, Glyphicon, Button } from "react-bootstrap";

import Callout from "../../widgets/callout/Callout";
import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import DateUtil from "../../utils/DateUtil";

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
        let start:moment.Moment = DateUtil.getDate(task.startDate);
        let end:moment.Moment = DateUtil.getDate(task.endDate);
        let workDuration = moment.duration(end.diff(start)).format("HH:mm");

        let tagsString = this.computeTaskTags(task.taskId);
        let projectName = this.computeProjectName(task.projectId);

        let buttonText = this.state.showBreaks ? "Hide Breaks" : "Show Breaks";

        let bsStyle = this.props.isOdd ? "warning" : null;

        return (
            <Callout key={task.taskId} bsStyle={bsStyle} className="task-item">
                <Row>
                    <Col md={2}>
                        <div>{DateUtil.extractTime(task.startDate)} - {DateUtil.extractTime(task.endDate)}</div>
                        <div>
                            <Button className="show-hide-button" bsSize="xsmall"
                                    onClick={this.handleShowBreaks.bind(this)}>{buttonText}</Button>
                        </div>
                    </Col>
                    <Col md={7}>
                        <div>{projectName}</div>
                        <div>{task.description}</div>
                    </Col>
                    <Col md={1}>
                        <div>{tagsString}</div>
                    </Col>
                    <Col md={2} className="text-right">
                        <div>{workDuration}</div>
                        <div>breakTime</div>
                    </Col>
                </Row>

                {this.renderBreaks(task.taskId)}
            </Callout>
        )
    }

    renderBreaks(taskId:string) {
        let breaks:IBreak[] = this.computeBreaks(taskId);
        let breakElements = _.map(breaks, (breakItem:IBreak, index:number) => this.renderBreak(breakItem, index));

        return (
            <Collapse in={this.state.showBreaks}>
                <div>
                    <ListGroup className="task-breaks">
                        {breakElements}
                    </ListGroup>
                </div>
            </Collapse>
        )
    }

    renderBreak(breakItem:IBreak, index:number) {
        let bsStyle = index%2 == 1 ? "warning" : null;

        let start:moment.Moment = DateUtil.getDate(breakItem.startDate);
        let end:moment.Moment = DateUtil.getDate(breakItem.endDate);
        let breakDuration = moment.duration(end.diff(start)).format("HH:mm");

        return (
            <ListGroupItem key={index} bsStyle={bsStyle}>
                <Row>
                    <Col md={2}>
                        <div>{DateUtil.extractTime(breakItem.startDate)} - {DateUtil.extractTime(breakItem.endDate)}</div>
                    </Col>
                    <Col md={8}>
                        <div>breakDescription</div>
                    </Col>
                    <Col md={2} className="text-right">
                        <div>{breakDuration}</div>
                    </Col>
                </Row>
            </ListGroupItem>
        )
    }

    handleShowBreaks() {
        this.setState({
            showBreaks: !this.state.showBreaks
        });
    }

    computeBreaks(taskId:string):IBreak[] {
        return _.filter(this.props.breaks, (breakItem: IBreak) => breakItem.taskId == taskId);
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
}

interface ITaskItemProps extends React.Props<TaskItem> {
    task: ITask,
    projects: IProject[],
    tags: ITag[],
    taskTags: ITaskTag[],
    breaks: IBreak[],
    isOdd: boolean
}
interface ITaskItemState {
    showBreaks?: boolean
}

export default TaskItem;