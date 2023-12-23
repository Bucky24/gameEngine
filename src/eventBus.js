export class EventBus {
    static init() {
        EventBus._listeners = {};
    }

    static listen(event, cb) {
        if (!EventBus._listeners[event]) {
            EventBus._listeners[event] = [];
        }
        EventBus._listeners[event].push(cb);
    }

    static trigger(event, data) {
        if (!EventBus._listeners[event]) {
            return;
        }

        for (const callback of EventBus._listeners[event]) {
            callback(data);
        }
    }
}