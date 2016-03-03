import _ from "lodash";
import IdUtil from "../utils/IdUtil";

import { IStore } from "./store";
import { IAction, ADD_TASK, ADD_TASK_TAG, ADD_BREAK, ADD_TAG } from "./actions";

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

        case ADD_TAG: {
            let newStore = _.cloneDeep(store);

            newStore.tags.push(action.payload);

            return newStore;
        }
    }

    return store;
}