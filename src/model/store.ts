import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { mainReducer } from "./reducers";

export interface IStore {
    projects?: IProject[];
    tasks?: ITask[];
    breaks?: IBreak[];
    tags?: ITag[];
    taskTags?: ITaskTag[];
}

export interface IProject {
    projectId: string;
    name: string;
    description: string;
    employer: string;
    location: string;
    status: number;
    salary: number;
    color: number;
    order: number;
    deleted: boolean;
    lastUpdate: number;
    tracking: number;
    network: string;
}

export interface ITask {
    taskId: string;
    projectId: string;
    description: string;
    location: string;
    locationEnd: string;
    startDate: string;
    endDate: string;
    phoneNumber: string;
    distance: number;
    feeling: number;
    billable: number;
    paid: number;
    rateId: string;
    user: string;
    deleted: boolean;
    lastUpdate: number;
    type: number;
    startTime: number;
    endTime: number;
}

export interface IBreak {
    breakId: string;
    taskId: string;
    description: string;
    startDate: string;
    endDate: string;
    user: string;
    deleted: boolean;
    lastUpdate: number;
    startTime: number;
    endTime: number;
}

export interface ITag {
    tagId: string;
    name: string;
    color: number;
    deleted: boolean;
    lastUpdate: number;
}

export interface ITaskTag {
    id: string;
    taskId: string;
    tagId: string;
    deleted: boolean;
    lastUpdate: number;
}

const store: any = applyMiddleware(thunk)(createStore)(mainReducer);

export default store;
