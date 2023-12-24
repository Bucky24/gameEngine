import { SystemEvents, InputTypes } from './constants.js';
import { EventBus } from './eventBus.js';

export class Input {
    static init(canvas) {
        Input._events = [];

        window.addEventListener("keydown", (e) => {
            const { key } = e;

            Input.startEvent(key, InputTypes.KEY);
        });

        window.addEventListener("keyup", (e) => {
            const { key } = e;

            Input.endEvent(key, InputTypes.KEY);
        });

        if (canvas) {
            canvas.addEventListener("mousedown", (e) => {
                const { button } = e;

                Input.startEvent(button, InputTypes.MOUSE);
            });
        }
    }

    static startEvent(data, type) {
        if (type === InputTypes.KEY) {
            EventBus.trigger(SystemEvents.KEY_DOWN, data);
        } else if (type === InputTypes.MOUSE) {
            EventBus.trigger(SystemEvents.MOUSE_DOWN, data);
        }
    }

    static endEvent(data, type) {
        if (type === InputTypes.KEY) {
            EventBus.trigger(SystemEvents.KEY_UP, data);
        }
    }
}