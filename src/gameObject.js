import { EventBus } from "./eventBus.js";

export class GameObject {
    constructor(params) {
        const { x, y, ...data } = params;
        this.x = x || 0;
        this.y = y || 0;
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

    render() {
        // noop
    }
}