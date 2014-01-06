'use strict';

var _config = require(__dirname + '/../config');
var _code = _config.code;

exports.generateResult = function(data, state, err) {
  var result = { 'success': true, 'code': _code[state] };
  if (_config.dev) {
    result['msg'] = state;
  }
  if (err) {
    var code = _code[err];
    code = code || 99999;
    result = { 'success': false, 'code': code, 'msg': err };
  }
  if (data == null) {
    data = {};
  }
  return data['result'] = result;
};




var _codes = require(__dirname + '/../config/code.json');

function getCode(err) {
  if (err == null) { return _codes['Success']; }
  return (_codes[err] == null ? _codes['Success'] : _codes[err]);
}



// TODO: pick up common error code when err is missing
exports.generateResult2 = function(err, data) {
  var msg = err || 'Success';
  var code = getCode(msg);
  var success = err == null ? true : false;
  var result = { 'success': success, 'code': code };
  if (_config.dev) {
    result['msg'] = msg;
  }

  if (data == null) {
    data = {};
  }
  return data['result'] = result;
};

