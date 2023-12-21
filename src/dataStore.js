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

    static push(key, value, scope) {
        if (!DataStore.data[scope]) {
            DataStore.data[scope] = {};
        }

        if (!DataStore.data[scope][key]) {
            DataStore.data[scope][key] = [];
        }

        DataStore.data[scope][key].push(value);
    }

    static get(key, scope, def = null) {
        if (!DataStore.data[scope]) {
           return null;
        }

        return DataStore.data[scope][key] || def;
    }
}

DataStore.GLOBAL = "datastore/scope/global";