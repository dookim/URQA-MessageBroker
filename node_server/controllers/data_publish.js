'use strict';
var gk                   = require('../common');
var mq_pubhandler        = require('../handler/mq_pubhandler');
var sampleExceptionData  = require('../json/exception_sample');
var sampleNativeData     = require('../json/native_sample');

var queueName            = gk.config.mqQueueName;

//테스트를 위해서
exports.send = function(req, res) {  
  var index;
  console.log('sampleExceptionData\n' + sampleExceptionData);
  console.log('sampleNativeData\n' + sampleNativeData);

  for(index=1; index < 50; index++){
    mq_pubhandler.publish(queueName, sampleExceptionData);
    } //Exception Sample Data

  for(index=1; index < 50; index++){
    mq_pubhandler.publish(queueName, sampleNativeData);
    } //Native Sample Data

  var result;
  result = { 'state': 'OK'};
  res.send(result);

};
