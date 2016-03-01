import * as React from "react";
import moment from "moment";
import "moment-duration-format";
import { Grid, Row, Col, Panel, Glyphicon } from "react-bootstrap";

import { ITask, IProject, ITag, ITaskTag } from "../../model/store";
import DateUtil from "../../utils/DateUtil";

class WorkingDay extends React.Component<IWorkingDayProps, IWorkingDayState> {
    render() {
        return (
            <Panel className="task-item" header={this.renderPanelHeader()}>
                {this.renderTasks()}
            </Panel>
        )
    }

    renderPanelHeader() {
        let daySummary:IDaySummary = this.computeDaySummary();

        let date:string;
        if (daySummary.startDate !== daySummary.endDate) {
            date = daySummary.startDate + " - " + daySummary.endDate;
        } else {
            date = daySummary.startDate;
        }

        return (
            <Row>
                <Col md={9}>{date}</Col>
                <Col md={1}>Tags</Col>
                <Col md={2} className="text-right">
                    <div>totalDayWorkTime</div>
                    <div>totalDayBreakTime</div>
                </Col>
            </Row>
        )
    }

    renderTasks() {
        return _.map(this.props.workingDay.tasks, (task:ITask) => this.renderTask(task));
    }

    renderTask(task:ITask) {
        let start = DateUtil.getDate(task.startDate);
        let end:moment.Moment = DateUtil.getDate(task.endDate);
        let workDuration = moment.duration(end.diff(start)).format("HH:mm");

        let tagsString = this.computeTaskTags(task.taskId);
        let projectName = this.computeProjectName(task.projectId);

        return (
            <Row key={task.taskId}>
                <Col md={2}>{DateUtil.extractTime(task.startDate)} - {DateUtil.extractTime(task.endDate)}</Col>
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
        )
    }

    computeTaskTags(taskId:string):string {
        let taskTags = _.filter(this.props.taskTags, {taskId: taskId});
        let tagIds = _.map(taskTags, (taskTag:ITaskTag) => taskTag.tagId);
        let tags = _.filter(this.props.tags, (tag:ITag) => {
            return _.indexOf(tagIds, tag.tagId) != -1;
        });

        return _.map(tags, (tag:ITag) => tag.name).join(",");
    }

    computeDaySummary():IDaySummary {
        let workingDay:IWorkingDay = this.props.workingDay;
        let daySummary:IDaySummary = {} as IDaySummary;

        daySummary.startDate = DateUtil.extractDate(workingDay.tasks[0].startDate);
        daySummary.endDate = DateUtil.extractDate(workingDay.tasks[0].endDate);

        return daySummary;
    }

    computeProjectName(projectId:string):string {
        let project:IProject = _.find(this.props.projects, {projectId});

        if (project) {
            return project.name;
        }
    }
}

interface IWorkingDayProps extends React.Props<WorkingDay> {
    workingDay: IWorkingDay,
    projects: IProject[],
    tags: ITag[],
    taskTags: ITaskTag[]
}

interface IWorkingDayState {
}

export interface IWorkingDay {
    tasks: ITask[]
}

interface IDaySummary {
    startDate: string,
    endDate: string
}

export default WorkingDay;