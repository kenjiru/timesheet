import { IStore, ITask, ITaskTag, IBreak, ITag } from "./store";

export interface IAction {
    type: string,
    payload?: Error|any,
    error?: boolean,
    meta?: any
}

export const ADD_TASK = "ADD_TASK";
export function addTask(task:ITask): IAction {
    return {
        type: ADD_TASK,
        payload: task
    }
}

export const UPDATE_TASK = "UPDATE_TASK";
export function updateTask(task:ITask): IAction {
    return {
        type: UPDATE_TASK,
        payload: task
    }
}

export const ADD_TASK_TAG = "ADD_TASK_TAG";
export function addTaskTag(taskTag:ITaskTag): IAction {
    return {
        type: ADD_TASK_TAG,
        payload: taskTag
    }
}

export const REMOVE_TASK_TAG = "REMOVE_TASK_TAG";
export function removeTaskTag(taskTag:ITaskTag): IAction {
    return {
        type: REMOVE_TASK_TAG,
        payload: taskTag
    }
}

export const ADD_BREAK = "ADD_BREAK";
export function addBreak(breakItem:IBreak): IAction {
    return {
        type: ADD_BREAK,
        payload: breakItem
    }
}
export const UPDATE_BREAK = "UPDATE_BREAK";
export function updateBreak(breakItem:IBreak): IAction {
    return {
        type: UPDATE_BREAK,
        payload: breakItem
    }
}

export const ADD_TAG = "ADD_TAG";
export function addTag(tag:ITag): IAction {
    return {
        type: ADD_TAG,
        payload: tag
    }
}

export const REMOVE_TAG = "REMOVE_TAG";
export function removeTag(tagId:string): IAction {
    return {
        type: REMOVE_TAG,
        payload: tagId
    }
}

export const UPDATE_TAG = "UPDATE_TAG";
export function updateTag(tag:ITag): IAction {
    return {
        type: UPDATE_TAG,
        payload: tag
    }
}

export const UPDATE_STORE = "UPDATE_STORE";
export function updateStore(store:IStore): IAction {
    return {
        type: UPDATE_STORE,
        payload: store
    }
}
