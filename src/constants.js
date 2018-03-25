var path = require('path')

module.exports = {
  DATA_FOLDER: path.join(__dirname, '../data'),
  DEFAULT_STATE: {
    lastSaved: null,
    currentScene: 0
  }
}
