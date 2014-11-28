var rfr = require('rfr');
var w = require('warmsea');

var NOS = rfr('core');

var Config = (function() {

  function Config(options) {
    options = this._extractCredentials(options);
    w.each(this._knownKeys, function(value, key) {
      this._set(key, options[key], value);
    }, this);
  }

  w.extend(Config.prototype, {

    _knownKeys: {
      credentials: null,
      params: null
    },

    _extractCredentials: function(options) {
      options = options || {};

      if (options.accessKeyId && options.secretAccessKey) {
        options = w.clone(options);
        options.credentials = new NOS.Credentials(options);
      }
      return options;
    },

    _set: function(property, value, defaultValue) {
      if (value === undefined) {
        value = defaultValue;
      }
      if (value === undefined) {
        value = this._knownKeys[property];
      }
      this[property] = value;
    },

    update: function(options, allowUnknownKeys) {
      options = this._extractCredentials(options);
      w.each(options, function(value, key) {
        if (allowUnknownKeys || this._knownKeys.hasOwnProperty(key)) {
          this[key] = value;
        }
      }, this);
    }
  });

  return Config;

})();

module.exports = Config;
