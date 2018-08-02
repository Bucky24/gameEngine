const maps = {};

const getTileIndex = (tiles, x, y) => {
	let index = null;
	
	tiles.forEach((tile, ind) => {
		if (tile.x === x && tile.y === y) {
			index = ind;
		}
		
	})
	
	return index;
};

Game.registerPlugin('Map', {
	createMap: (mapObj) => {
		const defaults = {
			width: 10,
			height: 10
		};
		mapObj = Object.assign({}, defaults, mapObj);
		const { id } = mapObj;
		if (maps[id]) {
			throw new Error(`Map with id ${id} already exists`);
		}
		const moreData = {
			tileTypes: {},
			tiles: []
		};
		console.log(`Created map with id ${id}`);
		maps[id] = Object.assign({}, moreData, mapObj);
		
		Game.draw(mapObj.canvasId, (bounds) => {
			const mapObj = maps[id];
			maps[id].tiles.forEach((tile) => {
				const x = tile.x * mapObj.cellSize;
				const y = tile.y * mapObj.cellSize;
				
				const typeCb = mapObj.tileTypes[tile.type];
				typeCb(x, y, x + mapObj.cellSize, y + mapObj.cellSize);
			});
			for (let i=0;i<mapObj.width;i++) {
				Draw.drawLine(
					i * mapObj.cellSize,
					0,
					i * mapObj.cellSize,
					mapObj.height * mapObj.cellSize,
					"#000"
				);
			}
			for (let i=0;i<mapObj.height;i++) {
				Draw.drawLine(
					0,
					i * mapObj.cellSize,
					mapObj.width * mapObj.cellSize,
					i * mapObj.cellSize,
					"#000"
				);
			}
			Draw.drawRect(
				0, 0,
				mapObj.width * mapObj.cellSize, mapObj.height * mapObj.cellSize,
				"#000",
				false
			);
			
			Draw.drawRect(0, 0, bounds.width, bounds.height, "#000", false);
		});
	},
	registerTileType: (id, type, drawCb) => {
		if (!maps[id]) {
			throw new Error(`Map with id ${id} does not exist`);
		}
		
		maps[id].tileTypes[type] = drawCb;
	},
	setTile: (id, tileObj) => {
		if (!maps[id]) {
			throw new Error(`Map with id ${id} does not exist`);
		}
		
		const index = getTileIndex(maps[id].tiles, tileObj.x, tileObj.y);
		
		if (!index) {
			maps[id].tiles.push(tileObj);
		} else {
			maps[id].tiles[index] = tileObj;
		}
	}
});