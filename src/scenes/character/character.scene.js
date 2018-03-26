var readline = require('readline')
var series = require('run-series')

const DEFAULT_PRINT_DELAY = 0.05

module.exports = renderScene

function renderScene (renderer, cb) {
  var messages = [
    screen.clear()
    text('Create a Character'),
    line('-',
    prompt('Type thy Lucky Number....'),
  ]

  printMessages(messages, renderer, cb)
}
