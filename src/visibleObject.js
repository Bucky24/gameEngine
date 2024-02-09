import { GameObject } from "./gameObject.js";

export class VisibleObject extends GameObject {
    constructor(params = {}) {
        const { x, y, width, height, ...data } = params;
        super(data);

        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    render() {
        // noop
    }
}