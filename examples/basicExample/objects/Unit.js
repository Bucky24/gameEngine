class Unit extends Engine.GameObject {
    onCreate() {
        this.listen(Engine.Constants.SystemEvents.KEY_DOWN, (key) => {
            if (key === Engine.Constants.Keys.ArrowRight) {
                this.x += 5;
            }
        });
    }

    render(context) {
        Engine.Draw.line(context, this.x, 0, this.x + 100, 100, "#000");
    }
}