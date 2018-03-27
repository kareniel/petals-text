#!/usr/bin/env node

var Game = require('./classes/Game')
const { DATA_FOLDER, DEFAULT_STATE } = require('./constants')

var game = new Game('Lord of Petals', {
  dataFolder: DATA_FOLDER,
  defaultState: DEFAULT_STATE
})

game.scene('intro', require('./scenes/intro'))

game.start()
