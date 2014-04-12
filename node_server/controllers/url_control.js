'use strict';
var gk                   = require('../common');
var mq_pubhandler        = require('../handler/mq_pubhandler');
var sampleExceptionData  = require('../json/exception_sample');
var sampleNativeData     = require('../json/native_sample');

var queueName            = gk.config.mqQueueName;

exports.connect = function(req, res) {  

  var data = { 'tag':'connect', 'data': req.body };

  var ret = mq_pubhandler.publish(queueName, data);
  var result = { 'state': ret };
  res.send(result); 
};


exports.receive_exception = function(req, res) { 
    
  var data = { 'tag':'receive_exception', 'data': req.body };

  var ret = mq_pubhandler.publish(queueName, data);
  var result = { 'state': ret };
  res.send(result);

};


exports.receive_native = function(req, res) {  
  
  var data = { 'tag':'receive_native', 'data': req.body };

  var ret = mq_pubhandler.publish(queueName, data);
  var result = { 'state': ret };
  res.send(result);
};


exports.receive_eventpath = function(req, res) {  

    var data = { 'tag':'receive_eventpath', 'data': req.body };
    
    var ret = mq_pubhandler.publish(queueName, req.body);
    var result = { 'state': ret };
    res.send(result);
};

exports.receive_native_dump = function(req, res) {  

    var data = { 'tag':'receive_native_dump', 'data': req.body };

    var ret = mq_pubhandler.publish(queueName, data);
    var result = { 'state': ret};
    res.send(result);
};


exports.receive_exception_log = function(req, res) {

    var data = { 'tag':'receive_exception_log', 'data': req.body };
    
    var ret = mq_pubhandler.publish(queueName, data);
    var result = { 'state': ret};
    res.send(result);  
};
