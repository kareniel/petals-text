module.exports = superClassFactory

function factory (superclass) {
  return {
    _superclass: class superclass,
    using: function (...mixins) {
      mixins.forEach(mixin => mixin(this._superclass))
    }
  }
}