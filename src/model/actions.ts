import { ITask } from "./store";

export const ADD_TASK = "ADD_TASK";
function addTask(task:ITask): IAction {
    return {
        type: ADD_TASK,
        payload: task
    }
}

export function addNewTask(task:ITask) {
    return dispatch => dispatch(addTask(task));
}

export interface IAction {
    type: string,
    payload?: any,
    error?: any,
    meta?: any
}