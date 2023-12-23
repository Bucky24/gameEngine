import { EventBus } from "./eventBus.js";
import { SystemEvents } from "./constants.js";

export class GameObject {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this._eventListeners = [];

        this.onCreate();
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

    render() {
        // noop
    }
}