var http = require('http');

var async = require('async');
var rfr = require('rfr');
var w = require('warmsea');

var Api = rfr('models/api');
var auth = rfr('auth');

var NOS = (function() {

  function NOS(config) {
    this.config = new NOS.Config(config);
    this.api = new Api(NOS.api || {});
  }

  w.extend(NOS, {

    _loadApi: function(api) {
      NOS.api = new Api(api);
      w.each(w.keys(NOS.api.operations), function(name) {
        var methodName = name[0].toLowerCase() + name.substring(1);
        NOS.prototype[methodName] = function(params, callback) {
          var operation = NOS.api.operations[name];
          return this._runOperation(operation, params, callback);
        };
      });
    }

  });

  w.extend(NOS.prototype, {

    calcAuthorization: function(operation, options) {
      if (!operation.isOperation) {
        operation = NOS.api.operations[operation];
      }
      var credentials = this.config.credentials || NOS.config.credentials;
      var headers = options.Headers || {};
      var signature = auth.calcSignatureForHeader({
        operation: operation,
        credentials: credentials,
        headers: headers,
        resource: options
      });
      return w.format('NOS %s:%s', credentials.accessKeyId, signature);
    },

    _runOperation: function(operation, params, callback) {
      var input = operation.createInput();
      input.push(this.config.params);
      input.push(params);
      var requestParams = input.process();
      requestParams.headers = requestParams.headers || {};
      requestParams.headers.Date = (new Date()).toUTCString();
      var signature = auth.calcSignatureForHeader({
        operation: operation,
        credentials: this.config.credentials || NOS.config.credentials,
        headers: requestParams.headers,
        resource: params
      });
      requestParams.headers.Authorization = w.format('NOS %s:%s',
          (this.config.credentials || NOS.config.credentials).accessKeyId,
          signature
      );
      if (input.errors) {
        callback(input.errors);
      } else {
        return this._request(requestParams, input.payload, callback);
      }
    },

    _request: function(params, payload, callback) {
      params = params || {};
      payload = payload || {};
      params.path = params.path || '/';
      if (params.qs) {
        var queryString = w.map(w.sortBy(w.keys(params.qs), function(name) {
          return name;
        }), function(name) {
          if (params.qs[name] === true) {
            return name;
          } else {
            return w.format('%s=%s', name, params.qs[name]);
          }
        }).join('&');
        if (queryString) {
          params.path += '?' + queryString;
        }
      }
      var req = http.request(params, function(res) {
        res.on('error', callback);
        var body = new Buffer(0);
        res.on('data', function(chunk) {
          body = Buffer.concat([body, chunk]);
        });
        res.on('end', function() {
          callback(null, res, body.toString());
        });
      });
      req.on('error', callback);
      if (payload.type === 'raw' && payload.items && payload.items.length) {
        async.eachLimit(payload.items, 1, function(item, callback) {
          writeRequest(req, item.value, callback);
        }, function(err) {
          if (err) {
            req.abort();
            callback(err);
          } else {
            req.end();
          }
        });
      } else {
        req.end();
      }
      return req;
    }

  });

  var writeRequest = function(req, value, callback) {
    if (value === undefined || value === null) {
      callback();
    } else if (value.readable) {  // As a binary Stream.
      value.on('error', function(err) {
        callback(err);
      });
      value.on('data', function(chunk) {
        try {
          req.write(chunk, 'binary');
        } catch (e) {
          callback(e);
        }
      });
      value.on('end', function() {
        callback();
      });
    } else {  // As a Buffer or a String.
      try {
        req.write(value);
        callback();
      } catch (e) {
        callback(e);
      }
    }
  };

  NOS._loadApi(rfr('api/nos'));

  return NOS;

})();

module.exports = NOS;
