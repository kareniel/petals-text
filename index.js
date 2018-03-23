#!/usr/bin/env node

var readline = require('readline')
var cursor = require('cli-cursor')
var mkdirp = require('mkdirp')
var chalk = require('chalk')
var path = require('path')
var util = require('util')
var fs = require('fs')
var log = console.log

mkdirp.sync('data')

process.stdin.setRawMode(true)
readline.emitKeypressEvents(process.stdin)

var debug = function () {
  var args = [].slice.call(arguments).map(util.inspect)
  return log(chalk.yellow(...args))
}

var keylog = function (str, key) {
  var ctrl = key.ctrl ? 'ctrl + ' : ''
  var shift = key.shift ? 'shift + ' : ''
  return ctrl + shift + key.name
}

class Menu {
  constructor (title, choices) {
    this.title = title
    this.choices = choices
    this.current = 0
    this.lines = ''
  }

  open () {
    this.render()

    cursor.hide()

    process.stdin.on('keypress', (str, key) => {
      var min = 0
      var max = this.choices.length - 1

      if (key.name === 'down') {
        if (this.current === max) return
        this.current = this.current + 1
      }

      if (key.name === 'up') {
        if (this.current === min) return
        this.current = this.current - 1
      }

      if (key.name === 'return') {
        var choice = this.choices[this.current]

        this.clear()
        choice.action()

        return
      }

      this.render()
    })
  }

  clear () {
    var numberOfLines = this.lines.split('\n').length

    if (numberOfLines <= 1) return

    readline.moveCursor(process.stdout, 0, -numberOfLines)
  }

  render () {
    this.clear()

    var lines = ''

    lines += `\n${this.title}\n\n`

    var highlighted, cursor, color

    this.choices.forEach((choice, index) => {
      highlighted = this.current === index
      cursor = highlighted ? '>' : ' '
      color = highlighted ? chalk.blue : chalk.white

      lines += color(`${cursor} ${index + 1}) ${choice.name}`)
      if (index !== this.choices.length - 1) lines += '\n'
    })

    this.lines = lines

    log(lines)
  }
}

class App {
  constructor () {
    log('terminu v0.1')

    this.files = openSaveFiles()

    this.state = {
      lastSaved: null
    }

    this.menu = new Menu('Main Menu', [{
      name: 'New',
      action: function () {

      }
    }, {
      name: 'Load',
      action: function () {
        var choices = this.files.map(file => {
          var lines = file.split('\n')
          var name = lines.pop(0)
          var lastIndex = lines.length - 1
          var data = lines[lastIndex]

          return {
            name,
            action: () => {
              debug('\n\n\n', 'data', data, '\n\n\n')
              process.exit()
            }
          }
        })

        console.log(choices)

        var loadMenu = new Menu('Load', choices)

        loadMenu.open()
      }
    }, {
      name: 'Exit',
      action: function () {
        log('\nok bye!')
        process.exit()
      }
    }])
  }

  start () {
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') return process.exit()
    })

    this.menu.open()
  }

  save () {
    debug('save')
    this.state.lastSaved = (new Date()).toISOString()
    var serializedState = JSON.stringify(this.state) + '\n'

    fs.appendFileSync('save.txt', `${serializedState}`)
  }

  load (callback) {
    debug('load')
    var serialized = fs.readFileSync('save.txt')
    var points = serialized.split('\n')
    var lastIndex = points.length - 1
    var state = JSON.parse(points[lastIndex])
    this.state = state
  }
}

function openSaveFiles () {
  var opts = { flag: 'a', encoding: 'utf8' }

  return Array(3).fill(0).map((_, index) => {
    var filepath = path.join(__dirname, `/data/${index + 1}.txt`)

    try {
      var file = fs.readFileSync(filepath, opts)

      return file
    } catch (err) {
      debug(err)
      fs.writeFileSync(filepath, 'No Data')
      return 'No Data'
    }
  })
}

new App().start()
