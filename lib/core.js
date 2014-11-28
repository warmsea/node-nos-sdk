var rfr = require('rfr');

var NOS = rfr('nos');

NOS.Config = rfr('models/config');
NOS.Credentials = rfr('models/credentials');

NOS.config = new NOS.Config();

module.exports = NOS;
