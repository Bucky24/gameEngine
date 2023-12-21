import { DataStore } from "./dataStore.js";
import { GameObject } from "./gameObject.js";
import { Renderers } from "./constants.js";

function init(params) {
    DataStore.init();

    const { type } = params;

    if (type === Renderers.TWOD) {
        const { canvas } = params;

        const canvasObj = document.getElementById("canvas");

        if (!canvasObj) {
            throw new Error("Cannot get element for", canvas);
        }

        DataStore.set('canvas', canvasObj, DataStore.GLOBAL);
    }
}

window.Engine = {
    DataStore,
    GameObject,
    Constants: {
        Renderers,
    },
    init,
};