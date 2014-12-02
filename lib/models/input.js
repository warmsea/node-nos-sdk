var w = require('warmsea');

var Input = (function() {

  function Input(http, rules, payload) {
    this._required = {};
    w.each(rules._required || {}, function(name) {
      this._required[name] = true;
    }, this);
    this.members = rules.members || {};
    this._uriParams = {};
    this.payload = {
      type: payload || 'raw',
      items: []
    };
    this._result = {
      method: http.method || 'GET',
      hostname: http.hostname || 'localhost',
      port: http.port || 80,
      path: http.path || '/',
      headers: {}
    };
    this.errors = [];
    this.processed = false;
  }

  w.extend(Input.prototype, {

    push: function(params) {
      if (this.processed) {
        throw new Error('Cannot push params to a processed input.');
      }
      params = params || {};
      w.each(params, function(param, name) {
        this._pushParam(name, param);
      }, this);
    },

    _pushParam: function(name, param) {
      var rule = this.members[name];
      if (!rule) {
        return;
      }

      this._required[name] = undefined;
      this._checkType(param, rule, name);

      var shape = rule.shape || 'Standard';
      if (!w.isFunction(this._pushParam[shape])) {
        this._pushError('%s: unsupported shape "%s"', name, shape);
      } else {
        this._pushParam[shape].call(this, param, rule, name);
      }
    },

    _checkType: function(param, rule, name) {
      var type = rule.type || 'string';
      if (!w.isFunction(this._checkType[type])) {
        this._pushError('%s: unsupported type "%s"', name, type);
      } else {
        this._checkType[type].call(this, param, rule, name);
      }
    },

    process: function() {
      if (this.processed) {
        throw new Error('Processed input cannot be processed again.');
      }
      w.each(this._required, function(value, name) {
        if (value) {
          this._pushError('%s: is required but not exists.', name);
        }
      }, this);
      w.each(['hostname', 'path'], function(name) {
        var that = this;
        this._result[name] = this._result[name].replace(
            /\$\{(\w+)\}/g,
            function(match, name) {
              return that._uriParams[name];
            }
        );
      }, this);

      // Set this.errors to null if there's no errors.
      if (!this.errors.length) {
        this.errors = null;
      }

      return this._result;
    },

    _pushError: function() {
      this.errors.push(w.format.apply(w, arguments));
    }
  });

  w.extend(Input.prototype._checkType, {
    blob: function(param, rule, name) {
      if (w.isString(param) || Buffer.isBuffer(param)) {
        // Passed
      } else if (rule.streaming && param.readable) {
        // Passed
      } else {
        this._pushError('%s: should be a string, buffer or stream.', name);
      }
    },
    object: function(param, rule, name) {
      if (!w.isPlainObject(param)) {
        this._pushError('%s: should be a plain object.', name);
      }
    },
    string: function(param, rule, name) {
      if (!w.isString(param)) {
        this._pushError('%s: should be a string.', name);
      }
    }
  });

  w.extend(Input.prototype._pushParam, {
    Standard: function(param, rule, name) {
      switch (rule.location) {
        case 'uri':
          this._uriParams[rule.locationName] = param;
          break;
        case 'header':
          this._result.headers[rule.locationName] = param;
          break;
        default:
          this._pushError('%s: unsupported location "%s"', name, rule.location);
      }
    },
    Metadata: function(param, rule, name) {
      param = param || {};
      switch (rule.location) {
        case 'headers':
          w.each(param, function(value, key) {
            if (!w.isString(value)) {
              this._pushError('%s.%s: metadata values should be strings',
                  name, key);
            }
            this._result.headers[rule.locationName + key] = value;
          }, this);
          break;
        default:
          this._pushError('%s: unsupported location "%s"', name, rule.location);
      }
    },
    Payload: function(param, rule, name) {
      this.payload.items.push({
        name: name,
        value: param,
        rule: rule
      });
    }
  });

  return Input;

})();

module.exports = Input;
