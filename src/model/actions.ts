import { ITask, ITaskTag } from "./store";

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

export function addNewTask(task:ITask) {
    return dispatch => dispatch(addTask(task));
}

export function addNewTaskTag(taskTag:ITaskTag) {
    return dispatch => dispatch(addTaskTag(taskTag));
}

export interface IAction {
    type: string,
    payload?: Error|any,
    error?: boolean,
    meta?: any
}