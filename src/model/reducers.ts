import _ from "lodash";
import IdUtil from "../utils/IdUtil";

import { IStore, ITag, ITask, IBreak } from "./store";
import { IAction, ADD_TASK, UPDATE_TASK, ADD_TASK_TAG, ADD_BREAK, UPDATE_BREAK,
    ADD_TAG, REMOVE_TAG, UPDATE_TAG, UPDATE_STORE } from "./actions";

let defaultStore = {
    tasks: [],
    projects: [{
        projectId: IdUtil.newId(),
        name: "Control Panel",
        employer: "MobFox",
        description: ""
    }, {
        projectId: IdUtil.newId(),
        name: "Private",
        employer: "",
        description: ""
    }],
    tags: [{
        tagId: IdUtil.newId(),
        name: "Office"
    }, {
        tagId: IdUtil.newId(),
        name: "Home"
    }],
    taskTags: [],
    breaks: []
};

export function mainReducer(store: IStore = defaultStore, action: IAction): IStore {
    switch (action.type) {
        case ADD_TASK: {
            let newStore = _.cloneDeep(store);

            newStore.tasks.push(action.payload);

            return newStore;
        }

        case UPDATE_TASK: {
            let newStore = _.cloneDeep(store);
            let updatedTask:ITask = <ITask> action.payload;

            newStore.tasks = _.map(newStore.tasks, (task: ITask) => (
                task.taskId == updatedTask.taskId ? updatedTask : task)
            );

            return newStore;
        }

        case ADD_TASK_TAG: {
            let newStore = _.cloneDeep(store);

            newStore.taskTags.push(action.payload);

            return newStore;
        }

        case ADD_BREAK: {
            let newStore = _.cloneDeep(store);

            newStore.breaks.push(action.payload);

            return newStore;
        }

        case UPDATE_BREAK: {
            let updatedBreak:IBreak = <IBreak> action.payload;
            let newStore = _.cloneDeep(store);

            newStore.breaks = _.map(newStore.breaks, (breakItem: IBreak) => (
                breakItem.breakId == updatedBreak.breakId ? updatedBreak : breakItem)
            );

            return newStore;
        }

        case ADD_TAG: {
            let newStore = _.cloneDeep(store);

            newStore.tags.push(action.payload);

            return newStore;
        }

        case REMOVE_TAG: {
            let newStore = _.cloneDeep(store);

            _.remove(newStore.tags, (tag:ITag) => tag.tagId == action.payload);

            return newStore;
        }

        case UPDATE_TAG: {
            let newTag:ITag = <ITag> action.payload;
            let newStore = _.cloneDeep(store);

            let tag = _.find(newStore.tags, (tag:ITag) => tag.tagId == newTag.tagId);
            tag.name = newTag.name;

            return newStore;
        }

        case UPDATE_STORE: {
            let newStore:IStore = _.cloneDeep(action.payload);

            return newStore;
        }
    }

    return store;
}