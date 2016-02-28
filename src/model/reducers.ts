import _ from "lodash";
import IdUtil from "../utils/IdUtil";

import { IStore } from "./store";
import { IAction, ADD_TASK } from "./actions";

let defaultStore = {
    tasks: [],
    projects: [{
        id: IdUtil.newId(),
        name: "Control Panel"
    }, {
        id: IdUtil.newId(),
        name: "Private"
    }]
};

export function mainReducer(store: IStore = defaultStore, action: IAction): IStore {
    switch (action.type) {
        case ADD_TASK: {
            let newStore = _.cloneDeep(store);

            newStore.tasks.push(action.payload);

            return newStore;
        }
    }

    return store;
}