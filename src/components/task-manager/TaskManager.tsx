import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";

import CreateTask from "../create-task/CreateTask";
import WorkingDayList from "../working-day-list/WorkingDaysList";

import { IStore, ITask } from "../../model/store";

class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
    render() {
        return (
            <div className="task-manager">
                <CreateTask dispatch={this.props.dispatch}/>
                <WorkingDayList tasks={this.props.tasks}/>
            </div>
        )
    }
}

interface ITaskManagerProps extends React.Props<TaskManager> {
    dispatch: (action) => void,
    tasks:ITask[]
}

interface ITaskManagerState { }

export default connect((store:IStore) => {
    return {
        tasks: store.tasks
    }
})(TaskManager);