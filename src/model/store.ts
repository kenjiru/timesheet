import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { mainReducer } from "./reducers";

export interface IStore {
    projects?: IProject[],
    tasks?: ITask[],
    breaks?: IBreak[],
    tags?: ITag[],
    taskTags?: ITaskTag[]
}

export interface IProject {
    projectId: string,
    name: string,
    employer: string,
    description: string
}

export interface ITask {
    taskId: string,
    projectId: string,
    startDate: string,
    endDate: string,
    description: string
}

export interface ITag {
    tagId: string,
    name: string
}

export interface ITaskTag {
    id: string,
    taskId: string,
    tagId: string
}

export interface IBreak {
    breakId: string,
    taskId: string,
    startDate: string,
    endDate: string,
    endTime: string,
    description: string
}

const store = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;