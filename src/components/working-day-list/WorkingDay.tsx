import * as React from "react";
import moment from "moment";
import "moment-duration-format";
import { Grid, Row, Col, Panel, Collapse, ListGroup, ListGroupItem, Glyphicon, Button } from "react-bootstrap";

import Callout from "../../widgets/callout/Callout";
import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import DateUtil from "../../utils/DateUtil";
import TaskItem from "./TaskItem";

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