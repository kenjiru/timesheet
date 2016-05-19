import * as React from "react";
import { Row, Col, Panel } from "react-bootstrap";

import TaskItem from "./../task-item/TaskItem";
import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import DateUtil from "../../utils/DateUtil";
import { IWorkBreakDuration } from "../../utils/DateUtil";

class WorkingDay extends React.Component<IWorkingDayProps, IWorkingDayState> {
    public render(): React.ReactElement<any> {
        return (
            <Panel className="working-day" header={this.renderPanelHeader()} collapsible defaultExpanded={true}>
                {this.renderTasks()}
            </Panel>
        );
    }

    private renderPanelHeader(): React.ReactElement<any> {
        let daySummary: IDaySummary = this.computeDaySummary();

        let date: string;
        if (daySummary.startDate !== daySummary.endDate) {
            date = daySummary.startDate + " - " + daySummary.endDate;
        } else {
            date = daySummary.startDate;
        }

        let workBreakDuration: IWorkBreakDuration =
            DateUtil.computeWorkBreakDuration(this.props.tasks, this.props.breaks);

        return (
            <Row>
                <Col xs={4} md={9}>{date}</Col>
                <Col xs={4} md={1}>Tags</Col>
                <Col xs={4} md={2} className="text-right">
                    <div>{DateUtil.formatDuration(workBreakDuration.workDuration)}</div>
                    <div>{DateUtil.formatDuration(workBreakDuration.breakDuration)}</div>
                </Col>
            </Row>
        );
    }

    private renderTasks(): React.ReactElement<any>[] {
        return _.map(this.props.tasks, (task: ITask, index: number) => {
            let breaks: IBreak[] = _.filter(this.props.breaks, (breakItem: IBreak) => breakItem.taskId === task.taskId);

            return (
                <TaskItem key={index} task={task} projects={this.props.projects} breaks={breaks}
                          tags={this.props.tags} taskTags={this.props.taskTags} isOdd={index % 2 === 1}/>
            );
        });
    }

    private computeDaySummary(): IDaySummary {
        let tasks: ITask[] = this.props.tasks;
        let daySummary: IDaySummary = {} as IDaySummary;

        daySummary.startDate = DateUtil.extractDate(tasks[0].startDate);
        daySummary.endDate = DateUtil.extractDate(tasks[tasks.length - 1].endDate);

        return daySummary;
    }
}

interface IWorkingDayProps extends React.Props<WorkingDay> {
    tasks: ITask[];
    projects: IProject[];
    tags: ITag[];
    taskTags: ITaskTag[];
    breaks: IBreak[];
}

interface IWorkingDayState {
}

interface IDaySummary {
    startDate: string;
    endDate: string;
}

export default WorkingDay;
