import * as React from "react";
import { connect } from "react-redux";

import CreateTask from "../create-task/CreateTask";
import WorkingDayList from "../working-day-list/WorkingDaysList";

import { IAction } from "../../model/actions";
import { IStore, ITask, IProject, ITag, ITaskTag, IBreak } from "../../model/store";

class TaskManager extends React.Component<ITaskManagerProps, ITaskManagerState> {
    public render(): React.ReactElement<any> {
        return (
            <div className="task-manager">
                <CreateTask dispatch={this.props.dispatch} projects={this.props.projects} tags={this.props.tags}/>
                <WorkingDayList tasks={this.props.tasks} projects={this.props.projects} breaks={this.props.breaks}
                                tags={this.props.tags} taskTags={this.props.taskTags}/>
            </div>
        );
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
