var readline = require('readline')
var chalk = require('chalk')

module.exports = class Menu {
  constructor (getChoices) {
    this.getChoices = getChoices
    this.current = 0
    this.lines = ''
  }

  up () {
    if (this.current === 0) return
    this.current--
  }

  down () {
    if (this.current === (this.choices.length - 1)) return
    this.current++
  }

  select () {
    var choice = this.choices[this.current]

    return choice.action
  }

  render () {
    var choices = this.choices = this.getChoices()
    var highlighted = 0
    var cursor = ' '
    var color = chalk.white
    var lines = ''

    choices.forEach((choice, index) => {
      highlighted = this.current === index
      cursor = highlighted ? '>' : ' '
      color = highlighted ? chalk.blue : chalk.white

      lines += color(`${cursor} ${choice.name}`)
      if (index !== choices.length - 1) lines += '\n'
    })

    this.lines = lines

    return lines
  }
}
