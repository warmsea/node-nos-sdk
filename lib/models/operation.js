var rfr = require('rfr');
var w = require('warmsea');

var Input = rfr('models/input');

var Operation = (function() {

  function Operation(name, operation) {
    this.name = name;
    operation = operation || {};

    this.http = w.deepcopy(operation.http || {});
    this.input = w.deepcopy(operation.input || {});
    this.payload = w.deepcopy(operation.payload || null);
  }

  w.extend(Operation.prototype, {

    createInput: function() {
      return new Input(this.http, this.input, this.payload);
    }

  });

  return Operation;

})();

module.exports = Operation;
