#!/bin/bash

if [ -f GameRunner.js ]; then
	./node_modules/.bin/electron ./GameRunner.js $1
else
	./node_modules/.bin/electron ./node_modules/gameEngine/GameRunner.js $1	
fi
