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
let text = '';

Game.registerInput(Mouse.ClickLeft, 'mainCanvas', ({ x, y }) => {
	mx = x;
	my = y;
});

Game.registerInput(Keyboard.TEXT, null, ({ keyChar }) => {
	text += keyChar;
});

Game.registerInput(Keyboard.BACKSPACE, null, () => {
	text = text.substring(0, text.length-1);
});

Game.draw('mainCanvas', () => {
	Draw.circle(mx, my, 5, "#f00", true);
	Draw.text(40, 40, `text: ${text}`, "#000", "20px Arial");
});