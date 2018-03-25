var Menu = require('../classes/Menu')
var Load = require('./load-menu.js')

Menu.UNTITLED = ''

module.exports = new Menu(Menu.UNTITLED, function () {
  var choices = [{
    name: 'Start',
    action: () => {
      this.game.openMenu(Load)
    }
  }, {
    name: 'Exit',
    action: () => {
      this.game.exit()
    }
  }]

  return choices
})
