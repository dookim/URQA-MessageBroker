'use strict'

var gk = require(__dirname + "/../common");

var host = "http://127.0.0.1:" + gk.config.port;

function flaushAllRedisData () {
  var servers = gk.config.redis.master;

  gk.async.up(0, servers.length, 1, function(i, next) {
    var host = servers[i].host;
    var port = servers[i].port;
    console.log('host: ' + host + ', port: ' + port);
    var redis = require('redis').createClient(port, host);
    redis.debug_mode = true;
    redis.on("error", function (err) {
      console.log("RedisError " + err);
    });
    redis.flushall(function(err) {
      next();
    });
  }, function() {
    gk.log.info('done');
    process.exit(0);
  });
}

flaushAllRedisData();
