Game.createWindow({
	x: 0, 
	y: 0,
	width: 500,
	height: 500
});

Game.createCanvas({
	x: 0,
	y: 0,
	width: 500,
	height: 500,
	scale: true,
	id: 'mainCanvas'
});

let x = 0;
let y = 0;
let xDiff = 10;
let yDiff = 10;

Game.mainLoop((tick) => {
	x += xDiff;
	y += yDiff;
	
	if (x >= 500) {
		x = 490;
		xDiff = -10;
	}
	if (y >= 500) {
		y = 490;
		yDiff = -10;
	}
	if (x <= 0) {
		x = 0;
		xDiff = 10;
	}
	if (y <= 0) {
		y = 0;
		yDiff = 10;
	}
	//console.log('tick', tick);
	// some logic here
});

Game.draw((bounds, id) => {
	Draw.drawRect(x, y, x+10, y+10, "#f00", true);
});

Game.registerInputs({
	UP: Keyboard.UP,
	DOWN: Keyboard.DOWN,
	CLICK: Mouse.ClickLeft
});

Game.onInput((inputCode, extraData) => {
	
});