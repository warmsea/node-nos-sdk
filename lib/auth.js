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
      default:  // case 'Object':
        var obj = w.format('/%s/%s', resource['Bucket'],
            encodeURIComponent(resource['Key']));
        var query = {};
        w.map(operation.input.members, function(member, name) {
          if (member.location === 'query') {
            var defaultValue = member.defaultValue;
            if (resource[name] !== undefined || defaultValue !== undefined) {
              query[member.locationName] = resource[name] || defaultValue;
            }
          }
        });
        var queryString = w.map(w.sortBy(w.keys(query), function(name) {
          return name;
        }), function(name) {
          if (query[name] === true) {
            return name;
          } else {
            return w.format('%s=%s', name, query[name]);
          }
        }).join('&');
        parts.push(queryString ? obj + '?' + queryString : obj);
    }

    // HMAC-SHA256 and then Base64
    var hmac = crypto.createHmac('sha256', credentials.secretAccessKey);
    hmac.update(parts.join('\n'));
    var signature = hmac.digest('base64');

    return signature;
  }

};
