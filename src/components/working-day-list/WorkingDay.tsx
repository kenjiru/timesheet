import * as React from "react";
import moment from "moment";
import { Grid, Row, Col, Panel, Glyphicon } from "react-bootstrap";

import { ITask } from "../../model/store";

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
                <Col md={2}>{this.extractTime(task.startDate)} - {this.extractTime(task.endDate)}</Col>
                <Col md={8}>
                    <div>taskProject</div>
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

        daySummary.startDate = this.extractDate(workingDay.tasks[0].startDate);
        daySummary.endDate = this.extractDate(workingDay.tasks[0].endDate);

        return daySummary;
    }

    extractDate(date:string):string {
        return moment(date, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY");
    }

    extractTime(date:string):string {
        return moment(date, "DD/MM/YYYY HH:mm").format("HH:mm");
    }
}

interface IWorkingDayProps extends React.Props<WorkingDay> {
    workingDay: IWorkingDay
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