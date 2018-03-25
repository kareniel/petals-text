var readline = require('readline')
var cursor = require('cli-cursor')
var mkdirp = require('mkdirp')
var path = require('path')
var fs = require('fs')
var log = console.log

class Game {
  constructor (name, opts) {
    this.name = name
    this.opts = opts

    this.state = opts.defaultState
    this.slot = null
    this.scenes = []

    this.menus = {}

    mkdirp.sync(opts.dataFolder)
    cursor.hide()
    readline.emitKeypressEvents(process.stdin)

    process.stdin.setRawMode(true)
  }

  start () {
    log(this.name)

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') return this.exit()
    })

    this.menus.main.open()
  }

  save () {
    this.state.lastSaved = (new Date()).toISOString()

    var serializedState = JSON.stringify(this.state) + '\n'
    var filepath = path.join(this.opts.dataFolder, this.slot, '.txt')

    fs.appendFileSync(filepath, `${serializedState}`)
  }

  load (state, slot) {
    var game = this

    game.state = state
    game.slot = slot

    var index = game.state.currentScene
    var scene = game.scenes[index]

    scene.enter.call(game)
  }

  registerScene (scene) {
    this.scenes.push(scene)
  }

  registerMenu (menu) {
    menu.game = this

    this.menus[menu.title] = menu
  }

  exit () {
    readline.clearScreenDown()
    process.exit()
  }
}

module.exports = Game
