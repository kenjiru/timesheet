import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";

import CreateTask from "../create-task/CreateTask";
import WorkingDayList from "../working-day-list/WorkingDaysList";

import { IStore, ITask, IProject, ITag, ITaskTag } from "../../model/store";

class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
    render() {
        return (
            <div className="task-manager">
                <CreateTask dispatch={this.props.dispatch} projects={this.props.projects} tags={this.props.tags}/>
                <WorkingDayList tasks={this.props.tasks} projects={this.props.projects} tags={this.props.tags}
                                taskTags={this.props.taskTags}/>
            </div>
        )
    }
}

interface ITaskManagerProps extends React.Props<TaskManager> {
    dispatch?: (action) => void,
    tasks?: ITask[],
    projects?: IProject[],
    tags?: ITag[],
    taskTags?: ITaskTag[]
}

interface ITaskManagerState { }

export default connect((store:IStore) => {
    return {
        tasks: store.tasks,
        projects: store.projects,
        tags: store.tags,
        taskTags: store.taskTags
    }
})(TaskManager);