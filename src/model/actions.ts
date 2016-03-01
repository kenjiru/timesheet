import { ITask, ITaskTag, IBreak } from "./store";

export const ADD_TASK = "ADD_TASK";
function addTask(task:ITask): IAction {
    return {
        type: ADD_TASK,
        payload: task
    }
}

export const ADD_TASK_TAG = "ADD_TASK_TAG";
function addTaskTag(taskTag:ITaskTag): IAction {
    return {
        type: ADD_TASK_TAG,
        payload: taskTag
    }
}

export const ADD_BREAK = "ADD_BREAK";
function addBreak(breakItem:IBreak): IAction {
    return {
        type: ADD_BREAK,
        payload: breakItem
    }
}

export function addNewTask(task:ITask) {
    return dispatch => dispatch(addTask(task));
}

export function addNewTaskTag(taskTag:ITaskTag) {
    return dispatch => dispatch(addTaskTag(taskTag));
}

export function addNewBreak(breakItem:IBreak) {
    return dispatch => dispatch(addBreak(breakItem));
}

export interface IAction {
    type: string,
    payload?: Error|any,
    error?: boolean,
    meta?: any
}