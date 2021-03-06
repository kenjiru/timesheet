import * as React from "react";

import { ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import DateUtil from "../../utils/DateUtil";
import WorkingDay from "./WorkingDay";

import "./WorkingDaysList.less";

class WorkingDaysList extends React.Component<IWorkingDaysListProps, IWorkingDaysListState> {
    constructor(props: IWorkingDaysListProps) {
        super(props);

        this.state = {
            workingDays: this.computeWorkingDays(this.props.tasks)
        };
    }

    public componentWillReceiveProps(nextProps: IWorkingDaysListProps): void {
        if (this.props.tasks !== nextProps.tasks) {
            this.setState({
                workingDays: this.computeWorkingDays(nextProps.tasks)
            });
        }
    }

    public render(): React.ReactElement<any> {
        return (
            <div className="working-days-list">
                { this.renderWorkingDays() }
            </div>
        );
    }

    private renderWorkingDays(): React.ReactElement<any>[] {
        return _.map(this.state.workingDays, (workingDay: IWorkingDay, index: number) => (
            <WorkingDay key={index} tasks={workingDay.tasks} projects={this.props.projects} breaks={this.props.breaks}
                        tags={this.props.tags} taskTags={this.props.taskTags}/>
        ));
    }

    private computeWorkingDays(tasks: ITask[]): IWorkingDay[] {
        let workingDaysMap: {[s: string]: IWorkingDay} = {};

        _.each(tasks, (task: ITask) => {
            let startDate: string = DateUtil.extractDate(task.startDate);
            let workingDay: IWorkingDay = workingDaysMap[startDate];

            if (workingDay) {
                workingDay.tasks.push(task);
            } else {
                workingDaysMap[startDate] = {
                    tasks: [task]
                };
            }
        });

        return _.values<IWorkingDay>(workingDaysMap);
    }
}

interface IWorkingDay {
    tasks: ITask[];
}

interface IWorkingDaysListProps extends React.Props<WorkingDaysList> {
    tasks: ITask[];
    projects: IProject[];
    tags: ITag[];
    taskTags: ITaskTag[];
    breaks: IBreak[];
}

interface IWorkingDaysListState {
    workingDays?: IWorkingDay[];
}

export default WorkingDaysList;
