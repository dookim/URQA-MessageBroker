'use strict';

var gk       = require('../common');
var _helper  = require(__dirname + '/../utils/helper');

// keys
//var _keyPrefix = gk.config.redis.namespace;
//var _baseKey = _keyPrefix + ':accounts:';
//var _tokensKey = _baseKey + 'tokens';
  

module.exports = function() {
  return function(req, res, next) {    
    gk.log.debug('[REQUEST URL] ',      req.url);
    gk.log.debug('[REQUEST PARAMS]===>> ', req.body);
    if (isNotNeedToBeChecked(req.url)) {
      return next();
    }

    var result = {};
    var token = req.body.token;
    if (token == null || token.length == 0) {
      return sendResult(res, result, 'MissingToken');
    }

  }
};


function isNotNeedToBeChecked(path) {
  var paths = ['/api', '/account', '/remoteapi', '/kakao/friends', '/patch', '/user/setup'];
  for (var i = 0; i < paths.length; i++) {
    if (path.substr(0, paths[i].length) == paths[i]) return true;
  }

  return false;
}


function sendResult(res, result, err) {
  _helper.generateResult(result, err, err);
  res.send(result);
}
