import { DataStore } from "./dataStore.js";
import { GameObject } from "./gameObject.js";
import { Renderers } from "./constants.js";

function init(params) {
    DataStore.init();

    const { type, fps } = params;

    if (type === Renderers.TWOD) {
        const { canvas } = params;

        const canvasObj = document.getElementById("canvas");

        if (!canvasObj) {
            throw new Error("Cannot get element for", canvas);
        }

        DataStore.set('canvas', canvasObj, DataStore.GLOBAL);
    }

    const timeout = setTimeout(update, 1000 / fps);
    DataStore.set('update_timeout', timeout, DataStore.GLOBAL);
}

function update() {
    const objects = DataStore.get('objects', DataStore.GLOBAL, []);

    for (const obj of objects) {
        obj.update();
    }
}

function register(obj) {
    DataStore.push('objects', obj, DataStore.GLOBAL);
}

window.Engine = {
    DataStore,
    GameObject,
    Constants: {
        Renderers,
    },
    init,
    register,
};