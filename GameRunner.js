const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

const gameFile = process.argv[2];

if (!gameFile) {
	console.log('USAGE: ' + path.basename(process.argv[1]) + " <game file>");
	process.exit(1);
}

const devTools = true;

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
	
	// do setup here
	global.Game = {
		createWindow: ({ x, y, width, height }) => {
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
		draw: (cb) => {
			registerEventHandler('draw', cb);
		},
		registerInputs: () => {}
	};
	
	let originX = 0;
	let originY = 0;
	let useWR = 1;
	let useHR = 1;
	global.Draw = {
		setOrigin: (x, y) => {
			originX = x;
			originY = y;
		},
		drawRect: (x, y, x2, y2, color, fill) => {
			sendMessage('draw', {
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
				cb.apply(null, data);
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
			if (eventFunctions['mainLoop'].length > 0) {
				triggerEvent('mainLoop', [tick]);
				tick ++;
				
				handleDrawing();
			}
		}, 100);
	});
	
	const handleDrawing = () => {
		useWR = 1;
		useHR = 1;
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
			
			Draw.setOrigin(panel.x, panel.y);
			triggerEvent('draw', [
				{
					width: realWidth,
					height: realHeight
				},
				panel.id
			]);
		});
		Draw.clearOrigin();
	}
	
	ipc.on('resize', (event, data) => {
		widthRatio = data.widthRatio;
		heightRatio = data.heightRatio;
		width = data.width;
		height = data.height;
		
		handleDrawing();
	});
	
	console.log('Loading game from ', fullFile);

	require(fullFile);
});

process.on('uncaughtException', (error) => {
	console.log(error);
});