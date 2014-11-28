var crypto = require('crypto');

var rfr = require('rfr');
var w = require('warmsea');

var NOS = rfr('core');

module.exports = {

  calcSignatureForHeader: function(operation, options) {
    options = options || {};
    var credentials = options.credentials;

    var headers = {};
    w.each(options.http.headers || {}, function(value, key) {
      headers[key.toLowerCase()] = value;
    });

    // Common headers
    var parts = [
      options.http.method,
      headers['content-md5'],
      headers['content-type'],
      headers['date']
    ];
    w.each(parts, function(value, key, parts) {
      if (value === undefined) {
        parts[key] = '';
      }
    });

    // Canonicalized headers
    w.each(w.sort(w.filter(w.keys(headers), function(key) {
      return key.indexOf('x-nos-') === 0;
    })), function(key) {
      parts.push(headers[key].trim());
    });

    // Cononicalized resource
    // TODO Check operation for bucket or object
    parts.push(options.http._signature);

    // HMAC-SHA256 and then Base64
    var hmac = crypto.createHmac('sha256', credentials.secretAccessKey);
    hmac.update(parts.join('\n'));
    var signature = hmac.digest('base64');

    return signature;
  }

};
