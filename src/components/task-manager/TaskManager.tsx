import * as React from "react";
import { connect } from "react-redux";
import * as moment from "moment";
import * as _ from "lodash";

import CreateTask from "../create-task/CreateTask";
import WorkingDayList from "../working-day-list/WorkingDaysList";
import FilterTasks from "../filter-tasks/FilterTasks";

import { IAction } from "../../model/actions";
import { IStore, ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";
import { IInterval, IMomentInterval } from "../../utils/CommonInterfaces";

class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
    constructor(props: ITaskManagerProps) {
        super(props);

        this.state = {
            filterInterval: null
        };
    }

    public render(): React.ReactElement<any> {
        let filteredTasks: ITask[] = this.filterItems(this.props.tasks);
        let filteredBreaks: IBreak[] = this.filterItems(this.props.breaks);

        return (
            <div className="task-manager">
                <CreateTask dispatch={this.props.dispatch} projects={this.props.projects} tags={this.props.tags}/>
                <FilterTasks tasks={filteredTasks} breaks={filteredBreaks}
                             onIntervalChange={this.handleIntervalChange.bind(this)}/>
                <WorkingDayList tasks={this.sortTasks(filteredTasks)} projects={this.props.projects}
                                breaks={filteredBreaks} tags={this.props.tags} taskTags={this.props.taskTags}/>
            </div>
        );
    }

    private handleIntervalChange(filterInterval: IMomentInterval): void {
        this.setState({
            filterInterval
        });

        console.log(filterInterval);
    }

    private filterItems<T extends IInterval>(items: T[]): T[] {
        if (_.isNil(this.state.filterInterval)) {
            return items;
        }

        let filterStartDate: moment.Moment = this.state.filterInterval.startDate;
        let filterEndDate: moment.Moment = this.state.filterInterval.endDate;

        return _.filter<T>(items, (item: T) => {
            return filterStartDate.isBefore(item.startDate) && filterEndDate.isAfter(item.endDate);
        });
    }

    private sortTasks(tasks: ITask[]): ITask[] {
        return _.sortBy(tasks, (task: ITask) => task.startDate).reverse();
    }
}

interface ITaskManagerProps extends React.Props<TaskManager> {
    dispatch?: (action: IAction) => void;
    tasks?: ITask[];
    projects?: IProject[];
    tags?: ITag[];
    taskTags?: ITaskTag[];
    breaks?: IBreak[];
}

interface ITaskManagerState {
    filterInterval: IMomentInterval;
}

export default connect((store: IStore) => {
    return {
        tasks: store.tasks,
        projects: store.projects,
        tags: store.tags,
        taskTags: store.taskTags,
        breaks: store.breaks
    };
})(TaskManager);
