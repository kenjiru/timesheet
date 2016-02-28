import * as React from "react";
import moment from "moment";

import { ITask } from "../../model/store";
import WorkingDay, { IWorkingDay } from "./WorkingDay";

import "./WorkingDaysList.less";

class WorkingDaysList extends React.Component<IWorkingDaysListProps, IWorkingDaysListState> {
    constructor(props:IWorkingDaysListProps) {
        super(props);

        this.state = {
            workingDays: this.computeWorkingDays(this.props.tasks)
        }
    }

    componentWillReceiveProps(nextProps:IWorkingDaysListProps) {
        if (this.props.tasks !== nextProps.tasks) {
            this.setState({
                workingDays: this.computeWorkingDays(nextProps.tasks)
            });
        }
    }

    render() {
        return (
            <div className="working-days-list">
                { this.renderWorkingDays() }
            </div>
        )
    }

    renderWorkingDays() {
        return _.map(this.state.workingDays, (workingDay:IWorkingDay) => <WorkingDay workingDay={workingDay}/>);
    }

    computeWorkingDays(tasks:ITask[]):IWorkingDay[] {
        let workingDaysMap: {[s: string]: IWorkingDay} = {};

        _.each(tasks, (task:ITask) => {
            let startDate = moment(task.startDate, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY");
            let workingDay:IWorkingDay = workingDaysMap[startDate];

            if (workingDay) {
                workingDay.tasks.push(task);
            } else {
                workingDaysMap[startDate] = {
                    tasks: [ task ]
                };
            }
        });

        return _.values<IWorkingDay>(workingDaysMap);
    }
}

interface IWorkingDaysListProps extends React.Props<WorkingDaysList> {
    tasks?: ITask[]
}

interface IWorkingDaysListState {
    workingDays?: IWorkingDay[]
}

export default WorkingDaysList;