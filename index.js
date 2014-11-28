var path = require('path');

var rfr = require('rfr');

rfr.root = path.join(__dirname, 'lib');

module.exports = rfr('core');
