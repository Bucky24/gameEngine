const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const fs = require('fs');

const gameFile = process.argv[2];

if (!gameFile) {
	console.log('USAGE: ' + path.basename(process.argv[1]) + " <game file>");
	process.exit(1);
}

let devTools = false;

app.on('ready', () => {
	const fullFile = path.resolve(gameFile);
	let mainWindow;
	let windowReady = false;
	let eventQueue = [];
	let mainLoopInterval;
	const eventFunctions = {};
	let tick;
	const panels = [];
	let width;
	let height;
	let widthRatio;
	let heightRatio;
	const doubleBuffering = true;
	
	// do setup here
	global.Game = {
		debug: (debug) => {
			devTools = debug;
		},
		createWindow: ({ width, height }) => {
			const useWidth = devTools ? width + 500 : width;
			mainWindow = new BrowserWindow({
				height,
				width: useWidth,
				webPreferences: {
					nodeIntegration: true,
       				contextIsolation: false,
				},
			});

			const url = require('url').format({
				protocol: 'file',
				slashes: true,
				pathname: path.join(
					__dirname,
					'electron_client',
					'index.html'
				)
			});
			mainWindow.loadURL(url);
			sendMessage('command', {
				event: 'init',
				params: {
					width,
					height
				}
			});
			
			if (devTools) {
		    	mainWindow.webContents.openDevTools();
			}
		},
		createCanvas: (params) => {
			const defaultParams = {
				scale: true
			};
			panels.push(Object.assign({}, defaultParams, params));
		},
		mainLoop: (cb) => {
			registerEventHandler('mainLoop', cb);
		},
		draw: (id, cb) => {
			registerEventHandler(`draw_${id}`, cb);
		},
		registerInput: (type, canvas, cb) => {
			const isMouse = Object.values(Mouse).includes(type);
			const key = isMouse ? `${canvas}_${type}` : type;
			registerEventHandler(key, cb);
		},
		loadPlugin: (pluginName) => {
			if (pluginName.indexOf("std::") === 0) {
				const realPlugin = pluginName.substring(5);
				
				const file = path.resolve(__dirname, 'plugins', `${realPlugin}.js`);
				if (!fs.existsSync(file)) {
					throw new Error(`Standard plugin ${realPlugin} not found`);
				}
				
				console.log('Loading plugin', realPlugin);
				require(file);
			} else {
				throw new Error('outside plugins not handled yet');
			}
		},
		registerPlugin: (name, object) => {
			global[name] = object;
		}
	};
	
	let originX = 0;
	let originY = 0;
	let useWR = 1;
	let useHR = 1;
	let activeCanvas = 'canvas';
	global.Draw = {
		setOrigin: (x, y) => {
			originX = x;
			originY = y;
		},
		setCanvas: (canvas) => {
			activeCanvas = canvas;
		},
		drawRect: (x, y, x2, y2, color, fill) => {
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'shape',
				shape: [
					{
						x: x * useWR + originX * useWR,
						y: y * useHR + originY * useHR
					},
					{
						x: x * useWR + originX * useWR,
						y: y2 * useHR + originY * useHR
					},
					{
						x: x2 * useWR+ originX * useWR,
						y: y2 * useHR + originY * useHR
					},
					{
						x: x2 * useWR+ originX * useWR,
						y: y * useHR + originY * useHR
					}
				],
				color,
				fill
			});
		},
		clearOrigin: () => {
			originX = 0;
			originY = 0;
		},
		drawLine: (x, y, x2, y2, color) => {
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'line',
				x1: x * useWR + originX * useWR,
				y1: y * useHR + originY * useHR,
				x2: x2 * useWR+ originX * useWR,
				y2: y2 * useHR + originY * useHR,
				color
			});
		},
		drawPattern: (patternId, x, y, width, height) => {
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'drawPattern',
				id: patternId,
				x,
				y,
				width,
				height
			});
		},
		savePattern: (patternId) => {
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'savePattern',
				id: patternId
			});
		},
		circle: (x, y, radius, color, fill) => {
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'circle',
				x,
				y,
				radius,
				color,
				fill
			});
		},
		text: (x, y, text, color, font) => {
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'text',
				x,
				y,
				text,
				color,
				font
			});
		},
		drawShape: (shape, color, fill) => {
			// filter the points
			const newShape = shape.map((point) => {
				return {
					x: point.x * useWR + originX * useWR,
					y: point.y * useHR + originY * useHR
				};
			});
			sendMessage('draw', {
				canvas: activeCanvas,
				type: 'shape',
				shape: newShape,
				color,
				fill
			});
		}
	};
	
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
		'abcdefghijklmnopqrstuvwxyz' +
		'1234567890-=[]\;\',./' +
		'!@#$%^&*()_+{}|:"<>?"' + 
		' '.split('');
		
	const specialKeys = ['BACKSPACE', 'TEXT'];
	
	global.Keyboard = {
		UP: 'keydown_ARROWUP',
		DOWN: 'keydown_ARROWDOWN',
		RIGHT: 'keydown_ARROWRIGHT',
		LEFT: 'keydown_ARROWLEFT'
	};
	
	specialKeys.forEach((key) => {
		global.Keyboard[key] = `keydown_${key}`;
	})
	
	global.Mouse = {
		ClickLeft: 'mouse_left',
		ClickRight: 'mouse_right',
		PressLeft: 'mouse_left_press',
		PressRight: 'mouse_right_press',
		Move: 'mouse_move'
	};
	
	global.Utils = {
		random: (min, max) => {
			// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
		    min = Math.ceil(min);
		    max = Math.floor(max);
		    return Math.floor(Math.random() * (max - min)) + min;
		},
		pointCollision: (rect, point) => {
			const { x1: rx1, y1: ry1, x2: rx2, y2: ry2 } = rect;
			const { x: px, y: py } = point;
			
			const maxX = Math.max(rx1, rx2);
			const minX = Math.min(rx1, rx2);
			const maxY = Math.max(ry1, ry2);
			const minY = Math.min(ry1, ry2);
			
			const result = (px >= minX && px <= maxX && py >= minY && py <= maxY);
			return result;
		},
		rectangleCollision: (rect1, rect2) => {
			const { x1: x11, y1: y11, x2: x12, y2: y12 } = rect1;
			const { x1: x21, y1: y21, x2: x22, y2: y22 } = rect2;
			
			// build the center of the rectangles
			const cx1 = Math.min(x11, x12) + (Math.max(x11, x12) - Math.min(x11, x12))/2;
			const cy1 = Math.min(y11, y12) + (Math.max(y11, y12) - Math.min(y11, y12))/2;
			const cx2 = Math.min(x21, x22) + (Math.max(x21, x22) - Math.min(x21, x22))/2;
			const cy2 = Math.min(y21, y22) + (Math.max(y21, y22) - Math.min(y21, y22))/2;

			return (
				Utils.pointCollision(rect1, { x: x21, y: y21 }) ||
				Utils.pointCollision(rect1, { x: x21, y: y22 }) ||
				Utils.pointCollision(rect1, { x: x22, y: y22 }) ||
				Utils.pointCollision(rect1, { x: x22, y: y21 }) ||
				// second rectangle
				Utils.pointCollision(rect2, { x: x11, y: y11 }) ||
				Utils.pointCollision(rect2, { x: x11, y: y12 }) ||
				Utils.pointCollision(rect2, { x: x12, y: y12 }) ||
				Utils.pointCollision(rect2, { x: x12, y: y11 }) ||
				// also check center points in case two rectangles are through each other
				Utils.pointCollision(rect1, { x: cx2, y: cy2 }) || 
				Utils.pointCollision(rect2, { x: cx1, y: cy1 })
			);
		}
	}
	
	const sendMessage = (event, data) => {
		if (!windowReady) {
			eventQueue.push({
				event,
				data
			});
		} else {
			mainWindow.webContents.send(event, data);
		}
	};
	
	const registerEventHandler = (event, cb) => {
		if (!eventFunctions[event]) {
			eventFunctions[event] = [];
		}
		eventFunctions[event].push(cb);
	};
	
	const triggerEvent = (event, data) => {
		if (!Array.isArray(data)) {
			data = [data];
		}
		if (eventFunctions[event]) {
			eventFunctions[event].forEach((cb) => {
				//console.log(cb, data);
				try {
					cb.apply(null, data);
				} catch (error) {
					console.log(`Unable to fire event ${event}: ${error.message}`);
					throw error;
				}
			});
		}
	};
	
	ipc.on('ready', () => {
		eventQueue.forEach((event) => {
			mainWindow.webContents.send(event.event, event.data);
		});
		eventQueue = [];
		tick = 0;
		windowReady = true;
		
		mainLoopInterval = setInterval(() => {
			if (eventFunctions['mainLoop'] &&
				eventFunctions['mainLoop'].length > 0
			) {
				triggerEvent('mainLoop', [tick]);
			}
			tick ++;
			handleDrawing();
		}, 10);
	});
	
	const mouseEvent = (x, y, event) => {
		let panelId = null;
		panels.forEach((panel) => {
			if (panel.x <= x && panel.x + panel.width >= x && panel.y <= y && panel.y + panel.height >= y) {
				panelId = panel.id;
			}
		});
		
		if (panelId) {
			const key = `${panelId}_${event}`;
			triggerEvent(key, { x, y });
		}
	}
	
	ipc.on('click', (event, { x, y, mouse }) => {
		mouseEvent(x, y, `mouse_${mouse}`);
	});
	
	ipc.on('press', (event, { x, y, mouse }) => {
		mouseEvent(x, y, `mouse_${mouse}_press`);
	});
	
	ipc.on('move', (event, { x, y }) => {
		mouseEvent(x, y, `mouse_move`);
	});
	
	ipc.on('click', (event, { x, y, mouse }) => {
		let panelId = null;
		panels.forEach((panel) => {
			if (panel.x <= x && panel.x + panel.width >= x && panel.y <= y && panel.y + panel.height >= y) {
				panelId = panel.id;
			}
		});
		
		if (panelId) {
			const key = `${panelId}_mouse_${mouse}`;
			triggerEvent(key, { x, y });
		}
	});
	
	ipc.on('key', (event, { code, char, evnt }) => {
		if (evnt === 'down') {
			if (alphabet.includes(char)) {
				triggerEvent(Keyboard.TEXT, { keyChar: char });
			} else {
				//console.log(`keydown_${char.toUpperCase()}`);
				triggerEvent(`keydown_${char.toUpperCase()}`);
			}
		}
	});
	
	const handleDrawing = () => {
		useWR = 1;
		useHR = 1;
		if (doubleBuffering) {
			Draw.setCanvas('canvas2');
		}
		Draw.drawRect(0, 0, width, height, "#fff", true);
		panels.forEach((panel) => {
			let realWidth = panel.width;
			let realHeight = panel.height;
			
			if (panel.scale) {
				realWidth *= widthRatio;
				realHeight *= heightRatio;
				useWR = widthRatio;
				useHR = heightRatio;
			} else {
				useWR = 1;
				useHR = 1;
			}
			// clear rectangle for the thing
			Draw.drawRect(0, 0, width, height, "#fff", true);
			triggerEvent(`draw_${panel.id}`, [
				{
					width: realWidth,
					height: realHeight
				}
			]);
			Draw.savePattern(`pattern_${panel.id}`);
		});
		Draw.setCanvas('canvas');
		Draw.drawRect(0, 0, width, height, "#fff", true);
		
		// draw all panels
		panels.forEach((panel) => {
			let realWidth = panel.width;
			let realHeight = panel.height;
			
			if (panel.scale) {
				realWidth *= widthRatio;
				realHeight *= heightRatio;
			}
			
			Draw.drawPattern(
				`pattern_${panel.id}`,
				panel.x * widthRatio,
				panel.y * heightRatio,
				realWidth,
				realHeight
			);
		});
	}
	
	ipc.on('resize', (event, data) => {
		widthRatio = data.widthRatio;
		heightRatio = data.heightRatio;
		width = data.width;
		height = data.height;
		
		handleDrawing();
	});
	
	console.log('Loading game from ', fullFile);

	try {
		require(fullFile);
	} catch (error) {
		console.error(error);
		app.quit();
	}
});

process.on('uncaughtException', (error) => {
	console.log(error);
});