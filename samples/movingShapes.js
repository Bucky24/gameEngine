Game.debug(true);

Game.createWindow({
	width: 500,
	height: 500
});

Game.createCanvas({
	x: 0,
	y: 0,
	width: 500,
	height: 500,
	id: 'mainCanvas'
});

const shapes = [
	{
		type: 'rect',
		x: 0,
		y: 0,
		xDiff: 10,
		yDiff: 10
	},
	{
		type: 'triangle',
		x: 100,
		y: 100,
		xDiff: -10,
		yDiff: 10
	}
];

Game.mainLoop((tick) => {
	shapes.forEach((shape) => {
		shape.x += shape.xDiff;
		shape.y += shape.yDiff;
	
		if (shape.x >= 500) {
			shape.x = 490;
			shape.xDiff = -10;
		}
		if (shape.y >= 500) {
			shape.y = 490;
			shape.yDiff = -10;
		}
		if (shape.x <= 0) {
			shape.x = 0;
			shape.xDiff = 10;
		}
		if (shape.y <= 0) {
			shape.y = 0;
			shape.yDiff = 10;
		}
	});
});

Game.draw("mainCanvas", (bounds) => {
	shapes.forEach((shape) => {
		switch (shape.type) {
			case 'rect':
				Draw.drawRect(shape.x, shape.y, shape.x+10, shape.y+10, "#f00", true);
				break;
			case 'triangle':
				Draw.drawShape([
					{ x: shape.x-10, y: shape.y-10 },
					{ x: shape.x+10, y: shape.y-10 },
					{ x: shape.x+5, y: shape.y }
				], "#f00", true);
				break;
		}
	});
});