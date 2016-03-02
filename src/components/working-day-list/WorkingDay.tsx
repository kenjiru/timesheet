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
            <Panel className="working-day" header={this.renderPanelHeader()}>
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
        return _.map(this.props.workingDay.tasks, (task:ITask) => (
            <TaskItem task={task} projects={this.props.projects} breaks={this.props.breaks} tags={this.props.tags}
                      taskTags={this.props.taskTags}/>
        ));
    }

    computeDaySummary():IDaySummary {
        let workingDay:IWorkingDay = this.props.workingDay;
        let daySummary:IDaySummary = {} as IDaySummary;

        daySummary.startDate = DateUtil.extractDate(workingDay.tasks[0].startDate);
        daySummary.endDate = DateUtil.extractDate(workingDay.tasks[0].endDate);

        return daySummary;
    }
}

interface IWorkingDayProps extends React.Props<WorkingDay> {
    workingDay: IWorkingDay,
    projects: IProject[],
    tags: ITag[],
    taskTags: ITaskTag[],
    breaks: IBreak[]
}

interface IWorkingDayState {
    showBreaks?: boolean
}

export interface IWorkingDay {
    tasks: ITask[]
}

interface IDaySummary {
    startDate: string,
    endDate: string
}

export default WorkingDay;