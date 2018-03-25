var readline = require('readline')
var chalk = require('chalk')

class Menu {
  constructor (title, getChoices) {
    this.title = title
    this.getChoices = getChoices
    this.current = 0
    this.lines = ''

    this.handleKeypress = this.handleKeypress.bind(this)
  }

  close () {
    process.stdin.removeListener('keypress', this.handleKeypress)
    this.clear()
  }

  clear () {
    this.prerender()
    process.stdout.write('\x1b[0J')
  }

  open () {
    this.choices = this.getChoices()
    process.stdin.on('keypress', this.handleKeypress)

    this.render()
  }

  prerender () {
    var numberOfLines = this.lines.split('\n').length

    if (numberOfLines <= 1) return

    readline.moveCursor(process.stdout, 0, -numberOfLines)
  }

  handleKeypress (str, key) {
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

      this.close()
      choice.action.call(this)

      return
    }

    this.render()
  }

  render () {
    this.prerender()

    var lines = ''

    lines += `${this.title}\n\n`

    var highlighted, cursor, color

    this.choices.forEach((choice, index) => {
      highlighted = this.current === index
      cursor = highlighted ? '>' : ' '
      color = highlighted ? chalk.blue : chalk.white

      lines += color(`${cursor} ${choice.name}`)
      if (index !== this.choices.length - 1) lines += '\n'
    })

    this.lines = lines

    process.stdout.write(lines)
  }
}

module.exports = Menu
