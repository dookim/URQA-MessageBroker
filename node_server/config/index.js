var os = require('os');
var hostname = os.hostname();

var code = require('./code.json');

if (hostname == 'A12038') {
  // This config is for lhs
  var config = require('./dev-user-config/lhs.json');
} else {
  // This config is for develop server
  var config = require('./develop.json');
}

config['code'] = code;

module.exports = config;

