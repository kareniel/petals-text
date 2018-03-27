var SuperClass = require('../helpers/SuperClass')

class Interface {
  constructor (interface) { return interface }
}

var IMovement = Interface({
  enter (scene, x = 0, y = 0) {
    this.scene = scene
    this.x = x
    this.y = y
  },

  move (x, y) {
    this.x = x
    this.y = y
  },

  moveTo (x, y, speed) {
    this.direction = { x, y }
    this.speed = speed
  }
})

class Actor extends SuperClass(Object).using(IMovement) {
  constructor () {
    this.x = 0
    this.y = 0
    this.speed = 0

    this.direction = null
    this.scene = null
  }
}

module.exports = Actor
