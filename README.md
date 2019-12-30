# gameEngine
A game engine!

This engine is designed for creating very quick prototypes without dealing with a lot of boilerplate code.

# Quick Start

First install the library

	npm install https://github.com/Bucky24/gameEngine.git

Then create a script, main.js, with the following content:

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

Then in your package.json, add the following:

    "scripts": {
		"start": "GameRunner ./main.js"
	}

# Objects

## Game

The Game object is where most of the important functions happen. Creation of windows, panels, registering event handlers, etc.

### createWindow
Creates and initializes an electron window.


**Parameters**

Parameter | required | description
---- | ---- | ----
width | true | The width of the window
height | true | The height of the window

    Game.createWindow({
	    width: 500,
	    height: 500
    });

### createCanvas
Creates a panel with specific dimensions on the main window

**Parameters**

Parameter | required | description
--- | --- | ---
id | true | the ID of the panel
x | true | x position of panel
y | true | y position of panel
width | true | width of panel
height | true | height of panel
scale | false | boolean, indicates if panel scales as window size changes. Defaults true

    Game.createCanvas({
	    id: 'mainCanvas',
	    x: 100,
	    y: 100,
	    width: 50,
	    height: 200
    });

### mainLoop
Registers a callback that is called every time the main loop runs

**Parameters**

Parameter | required | description
--- | --- | ---
cb | true | callback to call

**Callback Parameters**

The callback is called with these parameters

Parameter | description
--- | ---
tick | The current game tick

    Game.mainLoop((tick) => {
	    // do something
    });
	
### draw
Registers a callback for a specific canvas that is called every time that canvas runs.

**Parameters**

Parameter | required | description
--- | --- | ---
id | true | id of the canvas
cb | true | callback function to call

**Callback Parameters**

The callback is called with these parameters

Parameter | description
--- | ---
bounds | an object containing width and height of the canvas

    Game.draw('mainCanvas', ({ width, height }) => {
	    // draw something
    });
	
### loadPlugin
Directs the system to load a plugin into the global scope for further use

**Parameters**

Parameter | required | description
--- | --- | ---
pluginName | true | the name of the plugin. Putting "std::" in the front tells the system to load a standard plugin bundled with GameEngine

    Game.loadPlugin('std::map');
	
### registerPlugin
Meant to be called from the plugin to initialize it and make it available to the game.

**Parameters**

Parameter | required | description
--- | --- | ---
name | true | the name that will be added to the global scope
object | true | the object containing all the plugin's functions

    Game.registerPlugin("Map", {
        action: () => {}
    });

    // in game, after loading plugin

    Map.action();
	
### debug
Sets a debug flag. If the flag is set, the debug tools will show up in electron when the game is run.

**Parameters**

Parameter | required | description
--- | --- | ---
debug | true | boolean

    Game.debug(true);
	
### registerInput
Registers a game's interest in a particular input type.

**Parameters**

Parameter | required | description
--- | --- | ---
event | true | the event trigger
canvas | false | canvas to listen for events on. Only applies for mouse events
cb | true | callback to call

Callback parameters will vary depending on event

Event | parameter | description
--- | --- | ---
Keyboard.TEXT | keyChar | the character of the key typed
Mouse.* | x | the x position the mouse was at for the event
"" | y | the y position the mouse was at for the event

Event List:

	Keyboard.TEXT - fires on A-Za-z0-9 and most symbol keys
	Keyboard.BACKSPACE
	Keyboard.UP
	Keyboard.DOWN
	Keyboard.LEFT
	Keyboard.RIGHT
	Mouse.ClickLeft
	Mouse.ClickRight
	Mouse.PressLeft
	Mouse.PressRight
	Mouse.Move

    Game.registerInput(Mouse.ClickLeft, 'mainCanvas', ({ x, y }) => {
	    // do something
    });

## Draw

The Draw object is responsible for providing common drawing functionality for canvas. It is only available from inside a Game.draw callback.

### drawRect

Draws a rectangle with the given color between two points.

**Parameters**

Parameter | required | description
--- | --- | ---
x | true | start x
y | true | start y
x2 | true | end x
y2 | true | end y
color | true | html color code
fill | true | boolean indicating if rectangle is outline or filled

    Draw.drawRect(0, 0, 100, 100, "#F0F0F0", false);

### drawLine

Draws a line between two points

**Parameters**

Parameter | required | description
--- | --- | ---
x | true | start x
y | true | start y
x2 | true | end x
y2 | true | end y
color | true | html color code

    Draw.drawLine(0, 0, 100, "#F0F0F0");

### circle

Draws a circle of a given radius at a point

**Parameters**

Parameter | required | description
--- | --- | ---
x | true | center x
y | true | center y
radius | true | radius of circle
color | true | html color code
fill | true | boolean indicating if circle is outline or filled

    Draw.circle(100, 100, 10, "#F0F0F0", false);

### text

Draws text starting at a given position with a font and color

**Parameters**

Parameter | required | description
--- | --- | ---
x | true | center x
y | true | center y
text | true | string to draw
color | true | html color code
font | true | font to use

    Draw.text(100, 100, "Some text", "#F0F0F0", "20 px Arial");

### drawShape

Draws a shape from given coordinate pairs

**Parameters**

Parameter | required | description
--- | --- | ---
shape | true | an array of objects containing x and y (there must be at least 3 points)
color | true | html color code
fill | true | boolean indicating if shape is outline or filled

    Draw.drawShape([
		{ x: 50, y: 50 },
		{ x: 25, y: 25 },
		{ x: 100, y: 105 }
	], "#ff0000", false);

## Utils

The Utils object is general utilities that can be useful for game creation.

### random

Generates a random integer between two given integers

**Parameters**

Parameter | required | description
--- | --- | ---
min | true | min value (inclusive)
max | true | max value (exclusive)

    Utils.random(5, 10); // returns number between 5 and 9