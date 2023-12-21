import { DataStore } from "./dataStore.js";
import { GameObject } from "./gameObject.js";
import { Renderers } from "./constants.js";
import { line } from './draw.js'

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

    render();
}

function render() {
    const objects = DataStore.get('objects', DataStore.GLOBAL, []);
    const canvas = DataStore.get('canvas', DataStore.GLOBAL);
    const ctx = canvas.getContext("2d");

    console.log(objects);

    for (const obj of objects) {
        obj.render(ctx);
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
    Draw: {
        line,
    },
    init,
    register,
};