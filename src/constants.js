export const Renderers = {
    TEXT: 'renderers/text',
    TWOD: 'renderers/2d',
};

export const InputTypes = {
    KEY: 'input/key',
};

export const SystemEvents = {
    KEY_DOWN: 'events/key_down',
};

const keys = [
    'ArrowRight',
];

export const Keys = keys.reduce((obj, key) => {
    return {
        ...obj,
        [key]: key,
    }
}, {});