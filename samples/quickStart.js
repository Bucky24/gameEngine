Game.createWindow({
	width: 500,
	height: 500
});
Game.createCanvas({
	id: 'canvas',
	x: 0,
	y: 0,
	width: 500,
	height: 500
});

Game.draw('canvas', (bounds) => {
	Draw.drawRect(100, 100, 300, 300, "#f00", true);
});