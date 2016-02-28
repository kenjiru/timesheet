import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";

import CreateTask from "../create-task/CreateTask";
import WorkingDayList from "../working-day-list/WorkingDaysList";

import { IStore, ITask, IProject } from "../../model/store";

class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
    render() {
        return (
            <div className="task-manager">
                <CreateTask dispatch={this.props.dispatch} projects={this.props.projects}/>
                <WorkingDayList tasks={this.props.tasks} projects={this.props.projects}/>
            </div>
        )
    }
}

interface ITaskManagerProps extends React.Props<TaskManager> {
    dispatch?: (action) => void,
    tasks?: ITask[],
    projects?: IProject[]
}

interface ITaskManagerState { }

export default connect((store:IStore) => {
    return {
        tasks: store.tasks,
        projects: store.projects
    }
})(TaskManager);