'use strict'
var test    = require(__dirname + '/../controllers/publish_test');
var publish = require(__dirname + '/../controllers/data_publish');

var routes = function(app) {
  // test
  app.post('/test/publish$',test.send);
  
  //bumpdata
  app.post('/publish$', publish.send);
  
  //app.post('/urqa$', rqa.views.index);
  //app.post('/urqa/posttest$', urqa.views.posttest);
  //app.post('/urqa/fileuploadtest$', urqa.views.fileuploadtest);
  //app.post('/urqa/cleanup$', urqa.views.cleanup);

  //client module
  //app.post('/urqa/client/connect$', client.views.connect);
  //app.post('/urqa/client/send/exception$', client.views.receive_exception);
  //app.post('/urqa/client/send/exception/native$', client.views.receive_native);
  //app.post('/urqa/client/send/exception/dump/(?P<idinstance>\d+)$', 'client.views.receive_native_dump');
  //app.post('/urqa/client/send/exception/log/(?P<idinstance>\d+)$', 'client.views.receive_exception_log');
  //app.post('/urqa/client/send/eventpath$', client.views.receive_eventpath);

}
  
exports.route = routes;

