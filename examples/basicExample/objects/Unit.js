class Unit extends Engine.VisibleObject {
    onCreate() {
        this.xOff = 0;
        this.yOff = 0;

        this.listen(Engine.Constants.SystemEvents.KEY_DOWN, (key) => {
            switch (key) {
                case Engine.Constants.Keys.ArrowRight:
                    this.xOff = 5;
                    break;
                case Engine.Constants.Keys.ArrowLeft:
                    this.xOff = -5;
                    break;
                case Engine.Constants.Keys.ArrowUp:
                    this.yOff = -5;
                    break;
                case Engine.Constants.Keys.ArrowDown:
                    this.yOff = 5;
                    break;
            }
        });

        this.listen(Engine.Constants.SystemEvents.KEY_UP, (key) => {
            switch (key) {
                case Engine.Constants.Keys.ArrowRight:
                case Engine.Constants.Keys.ArrowLeft:
                    this.xOff = 0;
                    break;
                case Engine.Constants.Keys.ArrowUp:
                case Engine.Constants.Keys.ArrowDown:
                    this.yOff = 0;
                    break;
            }
        });
    }

    update() {
        this.x += this.xOff;
        this.y += this.yOff;
    }

    render(context) {
        Engine.Draw.line(context, this.x, this.y+this.height/2, this.x + this.width/2, this.y, "#000");
        Engine.Draw.line(context, this.x+this.width/2, this.y, this.x + this.width, this.y+this.height/2, "#000");
        Engine.Draw.line(context, this.x+this.width, this.y+this.height/2, this.x + this.width/2, this.y+this.height, "#000");
        Engine.Draw.line(context, this.x+this.width/2, this.y+this.height, this.x, this.y+this.height/2, "#000");
    }
}