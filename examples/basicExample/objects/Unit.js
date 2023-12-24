class Unit extends Engine.GameObject {
    onCreate() {
        this.xOff = 0;

        this.listen(Engine.Constants.SystemEvents.KEY_DOWN, (key) => {
            if (key === Engine.Constants.Keys.ArrowRight) {
                this.xOff = 5;
            } else if (key === Engine.Constants.Keys.ArrowLeft) {
                this.xOff = -5;
            }
        });

        this.listen(Engine.Constants.SystemEvents.KEY_UP, (key) => {
            if (key === Engine.Constants.Keys.ArrowRight || key === Engine.Constants.Keys.ArrowLeft) {
                this.xOff = 0;
            }
        });
    }

    update() {
        this.x += this.xOff;
    }

    render(context) {
        Engine.Draw.line(context, this.x, 0, this.x + 100, 100, "#000");
    }
}