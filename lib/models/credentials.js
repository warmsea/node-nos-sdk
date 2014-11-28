var w = require('warmsea');

var Credentials = (function() {

  function Credentials(options) {
    w.hideProperties(this, ['secretAccessKey']);
    this.accessKeyId = options.accessKeyId;
    this.secretAccessKey = options.secretAccessKey;
  }

  return Credentials;

})();

module.exports = Credentials;
