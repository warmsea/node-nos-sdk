var http = require('http');

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
        target: options
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
        target: params
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
      var req = http.request(params, function(res) {
        callback(null, res);
      });
      req.on('error', callback);
      if (payload && payload.type === 'raw') {
        w.each(payload.items, function(item) {
              var value = item.value;
              if (value.readable) {  // As a binary Stream.
                value.on('data', function(chunk) {
                  req.write(chunk, 'binary');
                });
                value.on('end', function() {
                  req.end();
                });
                value.on('error', function(err) {
                  req.abort();
                  callback(err);
                });
              } else {  // As a Buffer or a String.
                req.write(value);
                req.end();
              }
            }
        );
      }
      return req;
    }

  });

  NOS._loadApi(rfr('api/nos'));

  return NOS;

})();

module.exports = NOS;
