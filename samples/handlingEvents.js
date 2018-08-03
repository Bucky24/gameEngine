Game.debug(true);

Game.createWindow({
	width: 500,
	height: 500
});

Game.createCanvas({
	id: 'mainCanvas',
	x: 0,
	y: 0,
	width: 500,
	height: 500
});

let mx = 0;
let my = 0;

Game.registerInput(Mouse.ClickLeft, 'mainCanvas', ({ x, y }) => {
	mx = x;
	my = y;
});

Game.draw('mainCanvas', () => {
	Draw.circle(mx, my, 5, "#f00", true);
});