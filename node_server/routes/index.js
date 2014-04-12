'use strict'
var test    = require(__dirname + '/../controllers/publish_test');
var publish = require(__dirname + '/../controllers/data_publish');
var client = require(__dirname + '/../controllers/url_control');

var routes = function(app) {
  // test
  app.post('/test/publish',test.send);
  
  // bump data
  app.post('/publish', publish.send);
  
  //client module
  app.post('/urqa/client/connect', client.connect);
  app.post('/urqa/client/send/exception', client.receive_exception);
  app.post('/urqa/client/send/exception/native', client.receive_native);
  app.post('^urqa/client/send/exception/dump/(?P<idinstance>\d+)$', client.receive_native_dump),
  app.post('^urqa/client/send/exception/log/(?P<idinstance>\d+)$', client.receive_exception_log),
  app.post('/urqa/client/send/eventpath$', client.receive_eventpath);
}
  
exports.route = routes;

