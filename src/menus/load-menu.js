var fs = require('fs')
var path = require('path')
var Menu = require('../classes/Menu')
const { DATA_FOLDER, DEFAULT_STATE } = require('../constants')

module.exports = loadMenu

function loadMenu () {
  var files = openSaveFiles()

  var choices = files.map((file, i) => {
    var lines = file.split('\n')
    var name = lines.shift(0)
    var lastIndex = lines.length - 1
    var state = JSON.parse(lines[lastIndex])
    var slot = i + 1

    return {
      name: `${slot}) ${name}`,
      action: () => {
        this.game.load(state, slot)
      }
    }
  })

  return choices
}

function openSaveFiles () {
  var opts = { flag: 'a', encoding: 'utf8' }

  return Array(3).fill(0).map((_, index) => {
    var filepath = path.join(DATA_FOLDER, `${index + 1}.txt`)

    try {
      var file = fs.readFileSync(filepath, opts)

      return file
    } catch (err) {
      var nodata = `No Data\n${JSON.stringify(DEFAULT_STATE)}`

      fs.writeFileSync(filepath, nodata)

      return nodata
    }
  })
}
