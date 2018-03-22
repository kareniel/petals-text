#!/usr/bin/env node

var cli = require('inquirer')

console.reset = function () {
  return process.stdout.write('\x1Bc')
}

function print (text) {
  console.reset()
  if (text) process.stdout.write('\n' + text + '\n\n')
  return Promise.resolve()
}

var line = new cli.Separator()

var items = [
  {
    name: 'Apple',
    descriptions: [{
      triggers: [],
      text: () => {
        return `A red fruit.`
      }
    }]
  },
  {
    name: 'Orange',
    descriptions: [{
      triggers: [],
      text: () => {
        return `An orange fruit.`
      }
    }]
  }
]

var inventory = {
  items: items.slice(),
  prompt: function () {
    console.reset()

    var goBack = '< Back to menu'
    var questions = [{
      type: 'list',
      name: 'inventory',
      message: 'Inventory:',
      choices: [
        ...this.items,
        line,
        goBack
      ]
    }]

    return cli.prompt(questions).then(answers => {
      if (answers.inventory === goBack) return print()

      var itemName = answers.inventory
      var item = inventory.items.find(item => item.name === itemName)

      return print(item.descriptions[0].text()).then(() => inventory.prompt())
    })
  }
}

class App {
  start () {
    this.scene = {
      view: function () {
        return `You're standing in empty space.`
      }
    }

    this.actions = {
      'Inventory': () => inventory.prompt()
    }

    this.menu().then(() => {
      this.start()
    })
  }

  menu () {
    var questions = [{
      type: 'list',
      name: 'menu',
      message: this.scene.view,
      choices: [
        'Inventory'
      ]
    }]

    return cli.prompt(questions).then(answers => {
      var choice = answers['menu']

      return this.actions[choice]()
    })
  }
}

console.reset()

new App().start()
