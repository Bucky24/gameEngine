Engine.init({
    type: Engine.Constants.Renderers.TWOD,
    fps: 15,
    canvas: 'canvas',
});

const unit = new Unit({ width: 100, height: 100 });

Engine.register(unit);