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

let rects = [];
rects = [
	{
		x1: 100,
		y1: 50,
		x2: 400,
		y2: 450,
		color: '#f00',
		id: 1
	},
	{
		x1: 50,
		y1: 100,
		x2: 450,
		y2: 400,
		color: '#0f0',
		id: 2
	}
]
const colors = [
	'#f00',
	'#0f0',
	'#00f',
	'#ff0',
	'#0ff',
	'#000'
];

Game.mainLoop((tick) => {
	rects.forEach((rect) => {
		rect.colliding = false;
		rects.forEach((rect2) => {
			if (rect2.id === rect.id) {
				return;
			}
			if (Utils.rectangleCollision(rect, rect2)) {
				rect.colliding = true;
			}
		});
	});
});

Game.registerInput(Mouse.ClickLeft, 'canvas', () => {
	rects = [];
	
	const rectangleCount = Utils.random(2, 6);
	for (let i=0;i<rectangleCount;i++) {
		const rect = {
			x1: Utils.random(0, 500),
			x2: Utils.random(0, 500),
			y1: Utils.random(0, 500),
			y2: Utils.random(0, 500),
			color: colors[i],
			id: i
		};
		rects.push(rect);
	}
});

Game.draw('canvas', (bounds) => {
	rects.forEach((rect) => {
		Draw.drawRect(rect.x1, rect.y1, rect.x2, rect.y2, rect.color, rect.colliding);
	});
	Draw.text(0, 12, 'Click to create rectangles!', '#000', '12 px Arial');	
});