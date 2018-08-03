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
				width: useWidth
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
		registerInputs: () => {},
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
				type: 'rect',
				x1: x * useWR + originX * useWR,
				y1: y * useHR + originY * useHR,
				x2: x2 * useWR+ originX * useWR,
				y2: y2 * useHR + originY * useHR,
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
		}
	};
	
	global.Keyboard = {
		Up: 0,
		Down: 0
	};
	
	global.Mouse = {
		ClickLeft: 0
	};
	
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
		if (eventFunctions[event]) {
			eventFunctions[event].forEach((cb) => {
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
		}, 100);
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