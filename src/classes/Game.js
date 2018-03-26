var readline = require('readline')
var cursor = require('cli-cursor')
var mkdirp = require('mkdirp')
var path = require('path')
var fs = require('fs')
var log = console.log

var Menu = require('./Menu')
var Scene = require('./Scene')

class Renderer {
  constructor () {
    return {
      write: process.stdout.write.bind(process.stdout),
      cursor: {
        move: (x, y) => {
          readline.moveCursor(process.stdout, x, y)
        }
      }
    }
  }
}

class Game {
  constructor (name, opts) {
    this.name = name
    this.opts = opts

    this.state = opts.defaultState
    this.slot = 0
    this.scenes = {}
    this.menus = {}
    this.renderer = new Renderer()

    this.menu('main', require('../menus/main-menu'))
    this._setup()
  }

  start () {
    process.stdin.on('keypress', this.handleKeypress.bind(this))

    var scene = {
      render: (renderer, cb) => {
        renderer.write(this.name + '\n')
        cb()
      },
      menus: [ this.menus.main ]
    }

    this.go(new Scene(scene))
  }

  go (scene) {
    this._render(scene)
  }

  handleKeypress (str, key) {
    if (key.ctrl && key.name === 'c') return this.exit()

    if (this.currentMenu) {
      if (key.name === 'down') this.currentMenu.down()
      if (key.name === 'up') this.currentMenu.up()
      if (key.name === 'return') {
        var action = this.currentMenu.select()
        return action()
      }

      this._prerender()
      this.renderer.write(this.currentMenu.render())
    }
  }

  load (state, slot) {
    var game = this

    game.state = state
    game.slot = slot

    var index = game.state.currentScene
    var scene = game.scenes[index]

    this.go(scene)
  }

  save () {
    this.state.lastSaved = (new Date()).toISOString()

    var serializedState = JSON.stringify(this.state) + '\n'
    var filepath = path.join(this.opts.dataFolder, this.slot, '.txt')

    fs.appendFileSync(filepath, `${serializedState}`)
  }

  scene (name, config) {
    var scene = new Scene(config)

    this.scenes[name] = scene
  }

  menu (name, render) {
    var menu = new Menu(render)
    menu.game = this

    this.menus[name] = menu
  }

  exit () {
    var { rows, columns } = process.stdout

    readline.cursorTo(process.stdout, rows, columns)
    process.stdout.write('\n')

    process.exit()
  }

  _render (scene) {
    this._prerender()

    scene.render.call(this, this.renderer, () => {
      var menu = scene.menus[0]

      menu.game = this

      this.currentMenu = menu
      this.renderer.write(menu.render())
    })
  }

  _prerender () {
    var numberOfLines = (
      this.currentMenu ? this.currentMenu.lines.split('\n').length : 0
    )

    if (numberOfLines <= 1) return

    var { columns } = process.stdout

    readline.cursorTo(process.stdout, 0, columns)
    readline.moveCursor(process.stdout, 0, -numberOfLines + 1)
    readline.clearScreenDown(process.stdout)
  }

  _setup () {
    mkdirp.sync(this.opts.dataFolder)
    cursor.hide()
    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)
  }
}

module.exports = Game
