import * as React from "react";
import moment from "moment";
import { Grid, Row, Col, Panel, Glyphicon } from "react-bootstrap";

import { ITask, IProject } from "../../model/store";
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
                <Col md={6}>{date}</Col>
                <Col md={6} className="text-right">
                    <div>totalDayWorkTime</div>
                    <div>totalDayBreakTime</div>
                </Col>
            </Row>
        )
    }

    renderTasks() {
        return _.map(this.props.workingDay.tasks, task => this.renderTask(task));
    }

    renderTask(task:ITask) {
        return (
            <Row>
                <Col md={2}>{DateUtil.extractTime(task.startDate)} - {DateUtil.extractTime(task.endDate)}</Col>
                <Col md={8}>
                    <div>{this.getProjectName(task.projectId)}</div>
                    <div>{task.description}</div>
                </Col>
                <Col md={2} className="text-right">
                    <div>workTime</div>
                    <div>breakTime</div>
                </Col>
            </Row>
        )
    }

    computeDaySummary():IDaySummary {
        let workingDay:IWorkingDay = this.props.workingDay;
        let daySummary:IDaySummary = {} as IDaySummary;

        daySummary.startDate = DateUtil.extractDate(workingDay.tasks[0].startDate);
        daySummary.endDate = DateUtil.extractDate(workingDay.tasks[0].endDate);

        return daySummary;
    }

    getProjectName(projectId:string):string {
        let project:IProject = _.find(this.props.projects, {id: projectId});

        if (project) {
            return project.name;
        }
    }
}

interface IWorkingDayProps extends React.Props<WorkingDay> {
    workingDay: IWorkingDay,
    projects: IProject[]
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