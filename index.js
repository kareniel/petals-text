#!/usr/bin/env node

var fs = require('fs')
var readline = require('readline')
var cursor = require('cli-cursor')
var chalk = require('chalk')
var util = require('util')
var log = console.log

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
  constructor (choices) {
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

    lines += '\nMain Menu\n\n'

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

    this.state = {
      lastSaved: null
    }

    this.menu = new Menu([{
      name: 'New',
      action: function () {

      }
    }, {
      name: 'Load',
      action: function () {

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
      // if (['tab', 'escape'].includes(key.name)) return this.menu.open()
      // if (key.ctrl && 's') return this.save()
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

new App().start()
