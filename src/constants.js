export const Renderers = {
    TEXT: 'renderers/text',
    TWOD: 'renderers/2d',
};

export const InputTypes = {
    KEY: 'input/key',
    MOUSE: 'input/mouse',
};

export const SystemEvents = {
    KEY_DOWN: 'events/key_down',
    KEY_UP: 'events/key_up',
    MOUSE_DOWN: 'events/mouse_down',
};

export const MouseButtons = {
    LEFT: 0,
};

const keys = [
    'ArrowRight',
    'ArrowLeft',
    'ArrowUp',
    'ArrowDown',
];

export const Keys = keys.reduce((obj, key) => {
    return {
        ...obj,
        [key]: key,
    }
}, {});