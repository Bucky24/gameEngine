import { SystemEvents, InputTypes } from './constants.js';
import { EventBus } from './eventBus.js';

export class Input {
    static init() {
        Input._events = [];

        window.addEventListener("keydown", (e) => {
            const { key } = e;

            Input.startEvent(key, InputTypes.KEY);
        });
    }

    static startEvent(data, type) {
        if (type === InputTypes.KEY) {
            EventBus.trigger(SystemEvents.KEY_DOWN, data);
        }
    }
}