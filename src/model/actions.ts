import { ITask, ITaskTag, IBreak, ITag } from "./store";

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

export const ADD_TASK_TAG = "ADD_TASK_TAG";
export function addTaskTag(taskTag:ITaskTag): IAction {
    return {
        type: ADD_TASK_TAG,
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

export const ADD_TAG = "ADD_TAG";
export function addTag(tag:ITag): IAction {
    return {
        type: ADD_TAG,
        payload: tag
    }
}
