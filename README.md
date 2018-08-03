# gameEngine
A game engine!

This engine is designed for creating very quick prototypes without dealing with a lot of boilerplate code.

List of functions:

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

    Game.registerInput(Mouse.ClickLeft, 'mainCanvas', ({ x, y }) => {
	    // do something
    });
