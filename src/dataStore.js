export class DataStore {
    static init() {
        DataStore.data = {};
    }

    static set(key, value, scope) {
        if (!DataStore.data[scope]) {
            DataStore.data[scope] = {};
        }

        DataStore.data[scope][key] = value;
    }
}

DataStore.GLOBAL = "datastore/scope/global";