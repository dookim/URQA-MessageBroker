//'use strict';
var gk   = require('../common');
var amqp = require('amqp');

exports.LOGER_EXCHANGE_NAME     = gk.config.mqExchangeName;
exports.LOGER_QUEUE_NAME        = gk.config.mqQueueName;
var connection                  = amqp.createConnection(gk.config.mq);

var self            = this;
var _queue          = [];
var _isReady        = false;
var MAX_RETRY_COUNT = 5;
var retry           = 3;

connection.addListener('ready', function () {
  console.log("connected to " + connection.serverProperties.product);
  
  var exchange = connection.exchange(exports.LOGER_EXCHANGE_NAME ,{ type:"fanout", durable:true } );
  _queue[exports.LOGER_QUEUE_NAME] = exchange;
  _isReady = true;
});


process.addListener('exit', function () {
  console.log('Queue Exit ' + recvCount);
});


exports.publish = function(queueName, msg) {

  var retVal;
  console.log('pushData :', msg);

  retry = retry || 0;
  console.log('retry Value :', retry);

  if (retry > MAX_RETRY_COUNT){ 
    return; 
  }
  
  if (!_isReady) {
    // TODO: use backoff or wait for it
    process.nextTick(function() { exports.publish(exports.LOGER_QUEUE_NAME , msg, retry + 1); });
    console.log('nextTick RETURN !!!');
    return;
  }

  if (_queue.hasOwnProperty(queueName)) {
    console.log("publishing message");
    var exchange = _queue[queueName];
    exchange.publish(queueName, msg);
    console.log(queueName);
    return;
  } else {
    // TODO: binding queue automatically
    _isReady = false;
    console.log("WhatTheHuck? Couldn't find the queue");
    return;
  }
};


