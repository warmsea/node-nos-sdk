var crypto = require('crypto');
var w = require('warmsea');

module.exports = {

  calcSignatureForHeader: function(options) {
    options = options || {};
    var operation = options.operation;
    var credentials = options.credentials || {};
    var resource = options.resource || {};
    var headers = {};
    w.each(options.headers || {}, function(value, key) {
      headers[key.toLowerCase()] = value;
    });

    // Common headers
    var parts = [
      operation.http.method,
      headers['content-md5'] || '',
      headers['content-type'] || '',
      headers['date'] || ''
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
    switch (operation.resourceType) {
      case 'ListBucket':
        parts.push('/');
        break;
      case 'Bucket':
        parts.push('/%s', resource['Bucket']);
        break;
      case 'Object':
      default:
        parts.push(('/${Bucket}' + operation.http.path).replace(
            /\$\{(\w+)\}/g,
            function(match, name) {
              return encodeURIComponent(resource[name]);
            }
        ));
    }

    console.log(parts);
    // HMAC-SHA256 and then Base64
    var hmac = crypto.createHmac('sha256', credentials.secretAccessKey);
    hmac.update(parts.join('\n'));
    var signature = hmac.digest('base64');

    return signature;
  }

};
