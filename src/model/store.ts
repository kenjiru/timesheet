import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { mainReducer } from "./reducers";

export interface IStore {
    projects?: IProject[],
    tasks?: ITask[],
    breaks?: IBreak[]
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

interface ITag {
    tagId: string,
    name: string
}

interface IBreak {
    breakId: string,
    taskId: string,
    startDate: string,
    endDate: string,
    endTime: string,
    description: string
}

const store = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;