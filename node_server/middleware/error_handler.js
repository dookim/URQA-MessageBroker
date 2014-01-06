'use strict';

var gk = require('../common');

module.exports = function() {
  return function(err, req, res, next) {
    gk.log.debug('ErrorHandler');
    gk.log.error('Error: ', err.stack);
    res.send(500, 'Error with ' + err.stack);
  }
};