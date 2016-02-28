import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { mainReducer } from "./reducers";

export interface IStore {
    projects?: IProject[],
    tasks?: ITask[],
    breaks?: IBreak[]
}

export interface IProject {
    id: string,
    name: string,
    client?: string,
    description?: string,
    location?: string,
    rate?: string
}

export interface ITask {
    id: string,
    projectId: string,
    startDate: string,
    endDate: string,
    description: string,
    tagIds: string[]
}

interface ITag {
    id: string,
    label: string
}

interface IBreak {
    id: string,
    taskId: string,
    date: string,
    startTime: string,
    endTime: string,
    description: string
}

const store = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;