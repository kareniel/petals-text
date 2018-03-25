var readline = require('readline')
var series = require('run-series')
var Scene = require('../classes/Scene')
var Menu = require('../classes/Menu')

module.exports = new Scene(function () {
  var game = this
  var messages = [
    ['...', 0.5],
    ['...Hello?']
  ]

  var menu = new Menu('', function () {
    var choices = [{
      name: 'Exit',
      action: () => {
        game.exit()
      }
    }]
    return choices
  })

  printMessages(messages, function () {
    game.openMenu(menu)
  })
})

function printMessages (messages, cb) {
  var tasks = messages.map(message => {
    return (done) => {
      var text = message[0]
      var delay = message[1] || 0.05
      var i = 0

      print()

      function print () {
        process.stdout.write(text[i])
        i++

        setTimeout(() => {
          if (i < text.length) {
            print()
          } else {
            process.stdout.write('\n')
            done()
          }
        }, delay * 1000)
      }
    }
  })

  series(tasks, function () {
    readline.moveCursor(process.stdout, 0, 1)
    cb()
  })
}
