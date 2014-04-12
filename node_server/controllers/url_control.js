'use strict';
var gk                   = require('../common');
var mq_pubhandler        = require('../handler/mq_pubhandler');
var sampleExceptionData  = require('../json/exception_sample');
var sampleNativeData     = require('../json/native_sample');

var queueName            = gk.config.mqQueueName;

exports.connect = function(req, res) {  
  var ret = mq_pubhandler.publish(queueName, req.body);
  var result = { 'state': ret };
  res.send(result); 
};


exports.receive_exception = function(req, res) { 
  var ret = mq_pubhandler.publish(queueName, req.body);
  var result = { 'state': ret };
  res.send(result);

};


exports.receive_native = function(req, res) {  
  var ret = mq_pubhandler.publish(queueName, req.body);
  var result = { 'state': ret };
  res.send(result);
};


exports.receive_eventpath = function(req, res) {  
  var ret = mq_pubhandler.publish(queueName, req.body);
  var result = { 'state': ret };
  res.send(result);
  
};

exports.receive_native_dump = function(req, res) {  
  var ret = mq_pubhandler.publish(queueName, req.body);
  var result = { 'state': ret};
  res.send(result);
};


exports.receive_exception_log = function(req, res) {  
  var ret = mq_pubhandler.publish(queueName, req.body);
  var result = { 'state': ret};
  res.send(result);  
};
