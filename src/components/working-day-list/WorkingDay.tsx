import * as React from "react";
import moment from "moment";
import "moment-duration-format";
import { Grid, Row, Col, Panel, Collapse, ListGroup, ListGroupItem, Glyphicon, Button } from "react-bootstrap";

import Callout from "../../widgets/callout/Callout";
import TaskItem from "./../task-item/TaskItem";
import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import DateUtil from "../../utils/DateUtil";

class WorkingDay extends React.Component<IWorkingDayProps, IWorkingDayState> {
    render() {
        return (
            <Panel className="working-day" header={this.renderPanelHeader()} collapsible defaultExpanded={true}>
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

        let workDuration = this.computeWorkDuration();
        let breakDuration = this.computeBreakDuration();

        return (
            <Row>
                <Col xs={4} md={9}>{date}</Col>
                <Col xs={4} md={1}>Tags</Col>
                <Col xs={4} md={2} className="text-right">
                    <div>{DateUtil.formatDuration(workDuration)}</div>
                    <div>{DateUtil.formatDuration(breakDuration)}</div>
                </Col>
            </Row>
        )
    }

    renderTasks() {
        return _.map(this.props.tasks, (task:ITask, index:number) => {
            let breaks = _.filter(this.props.breaks, (breakItem: IBreak) => breakItem.taskId == task.taskId);

            return (
                <TaskItem key={index} task={task} projects={this.props.projects} breaks={breaks}
                          tags={this.props.tags} taskTags={this.props.taskTags} isOdd={index%2 == 1}/>
            )
        });
    }

    computeDaySummary():IDaySummary {
        let tasks = this.props.tasks;
        let daySummary:IDaySummary = {} as IDaySummary;

        daySummary.startDate = DateUtil.extractDate(tasks[0].startDate);
        daySummary.endDate = DateUtil.extractDate(tasks[tasks.length-1].endDate);

        return daySummary;
    }

    computeWorkDuration():moment.Duration {
        let workingDuration = DateUtil.computeTotalDuration(this.props.tasks);
        let breakDuration = this.computeBreakDuration();

        return workingDuration.subtract(breakDuration);
    }

    computeBreakDuration():moment.Duration {
        let totalBreakDuration = moment.duration();

        _.each(this.props.tasks, (task:ITask) => {
            let breaks = _.filter(this.props.breaks, (breakItem: IBreak) => breakItem.taskId == task.taskId);
            let breakDuration = DateUtil.computeTotalDuration(breaks);

            totalBreakDuration.add(breakDuration);
        });

        return totalBreakDuration;
    }
}

interface IWorkingDayProps extends React.Props<WorkingDay> {
    tasks: ITask[],
    projects: IProject[],
    tags: ITag[],
    taskTags: ITaskTag[],
    breaks: IBreak[]
}

interface IWorkingDayState {}

interface IDaySummary {
    startDate: string,
    endDate: string
}

export default WorkingDay;