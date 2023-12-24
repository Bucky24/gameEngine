import { EventBus } from "./eventBus.js";

export class GameObject {
    constructor(data = {}) {
        this._eventListeners = [];

        this.onCreate(data);
    }

    onCreate() {
        // noop
    }

    listen(event, cb) {
        const id = EventBus.listen(event, cb);
        this._eventListeners.push(id);
    }

    update() {
        // noop
    }
}