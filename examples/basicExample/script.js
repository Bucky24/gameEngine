Engine.init({
    type: Engine.Constants.Renderers.TWOD,
    fps: 15,
    canvas: 'canvas',
});

const unit = new Unit();

Engine.register(unit);