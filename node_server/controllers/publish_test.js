
'use strict';
var gk             = require('../common');
var mq_pubhandler  = require('../handler/mq_pubhandler');
var queueName      = gk.config.mqQueueName;

//테스트를 위해서
exports.send = function(req, res) {  
  
  var index;
  for(index=1; index < 100; index++){
    var data = {"info": { "app_id":"loggerData", "type": "access" },
                "data": { "aid":"CVC001" ,"page": "/quest/progress","is_smartphone":1,"device":4,"timestamp": 13806902 }
               }
               
               mq_pubhandler.publish(queueName, data);
    } //for

  var result;
  result = { 'state': 'OK'};
  res.send(result);


};
