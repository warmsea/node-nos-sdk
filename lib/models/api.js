var w = require('warmsea');

var Operation = require('./operation');

var Api = (function() {

  function Api(api) {
    api = api || {};
    if (api.isApi) {
      return w.clone(api);
    }

    this.isApi = true;
    this.operations = {};
    w.each(api.operations, function(value, key) {
      this.operations[key] = new Operation(key, value);
    }, this);
  }

  return Api;

})();

module.exports = Api;
