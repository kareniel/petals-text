var readline = require('readline')
var series = require('run-series')

const DEFAULT_PRINT_DELAY = 0.05

module.exports = renderScene

function renderScene (renderer, cb) {
  var messages = [
    ['...', 0.5],
    ['...Hello?']
  ]

  printMessages(messages, renderer, cb)
}

function printMessages (messages, renderer, callback) {
  var tasks = messages.map(getMessageTask)

  series(tasks, function () {
    renderer.cursor.move(0, 1)
    callback()
  })

  function getMessageTask (message) {
    var text = message[0]
    var delay = message[1] || DEFAULT_PRINT_DELAY
    var i = 0

    return function messageTask (done) {
      print()

      function print () {
        renderer.write(text[i])

        setTimeout(function nextIteration () {
          i++

          if (i < text.length) {
            print()
          } else {
            renderer.write('\n')
            done()
          }
        }, delay * 1000)
      }
    }
  }
}
