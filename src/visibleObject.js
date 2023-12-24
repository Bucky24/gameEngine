import { GameObject } from "./gameObject.js";

export class VisibleObject extends GameObject {
    constructor(params = {}) {
        const { x, y, ...data } = params;
        super(data);

        this.x = x || 0;
        this.y = y || 0;
    }

    render() {
        // noop
    }
}