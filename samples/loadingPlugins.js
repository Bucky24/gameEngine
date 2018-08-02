Game.debug(true);

Game.createWindow({
	x: 0, 
	y: 0,
	width: 500,
	height: 500
});

Game.loadPlugin("std::map");

Game.createCanvas({
	x: 0,
	y: 0,
	width: 500,
	height: 500,
	id: 'mainCanvas'
});

Game.createCanvas({
	x: 100,
	y: 0,
	width: 300,
	height: 300,
	id: 'mapCanvas'
});

Map.createMap({
	id: 'mainMap',
	canvasId: 'mapCanvas',
	cellSize: 10
});

Map.registerTileType('mainMap', 'grass', (x, y, x2, y2) => {
	Draw.drawRect(x, y, x2, y2, "#0f0");
});

Map.setTile('mainMap', { x: 3, y: 3, type: 'grass'});
Map.setTile('mainMap', { x: 4, y: 4, type: 'grass'});

Game.draw("mainCanvas", (bounds) => {
	Draw.drawRect(0, 0, 100, 100, "#f00", true);
});