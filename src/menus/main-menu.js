var Menu = require('../classes/Menu')
var Scene = require('../classes/Scene')
var loadMenu = require('./load-menu.js')

module.exports = mainMenu

function mainMenu () {
  this.game.menu('load', loadMenu)

  var choices = [{
    name: 'Start',
    action: () => {
      var scene = {
        render: (renderer, cb) => {
          cb()
        },
        menus: [
          this.game.menus['load']
        ]
      }

      this.game.go(new Scene(scene))
    }
  }, {
    name: 'Exit',
    action: () => {
      this.game.exit()
    }
  }]

  return choices
}
