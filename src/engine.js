import { DataStore } from "./dataStore.js";
import { GameObject } from "./gameObject.js";
import { Renderers, SystemEvents, Keys } from "./constants.js";
import { line, rect } from './draw.js'
import { Input } from './input.js';
import { EventBus } from "./eventBus.js";

function init(params) {
    DataStore.init();
    Input.init();
    EventBus.init();

    const { type, fps } = params;

    if (type === Renderers.TWOD) {
        const { canvas } = params;

        const canvasObj = document.getElementById("canvas");

        if (!canvasObj) {
            throw new Error("Cannot get element for", canvas);
        }

        DataStore.set('canvas', canvasObj, DataStore.GLOBAL);
    }

    const interval = setInterval(update, 1000 / fps);
    DataStore.set('updatetinterval', interval, DataStore.GLOBAL);
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

    rect(ctx, 0, 0, canvas.width, canvas.height, "#fff", true);

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
    EventBus,
    Constants: {
        Renderers,
        SystemEvents,
        Keys,
    },
    Draw: {
        line,
    },
    init,
    register,
};