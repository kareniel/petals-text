var Menu = require('../../classes/Menu')

module.exports = new Menu(function () {
  var choices = [{
    name: 'Exit',
    action: () => {
      this.game.exit()
    }
  }]

  return choices
})
