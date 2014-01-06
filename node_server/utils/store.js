var _config = require('../config');

var _fs = require('fs');
var _crypto = require('crypto');
// var _hash = require('mhash').hash;
var _store = [];

var Store = function(scriptsDir) {
  this.scripts = {};
  var self = this;
  scriptsDir = scriptsDir || '../scripts/lua/';
  scriptsDir = __dirname + '/' + scriptsDir;
  var scripts = _fs.readdirSync(scriptsDir);
  scripts.forEach(function(s) {
    var key = s.replace('.lua', '');
    key = key.toLowerCase();
    console.log('script file(' + scriptsDir + s + ') loaded as key:' + key);
    self.scripts[key] = _fs.readFileSync(scriptsDir + s, 'utf8');
  });
};

Store.prototype.getScript = function(name) {
  return this.scripts[name.toLowerCase()];
};

Store.prototype.extend = function(redis) {
  for (var n in this.scripts) {
    if (this.scripts.hasOwnProperty(n)) {
      //console.log('hasOwnProperty:' + n);
      var script = this.getScript(n);
      (function(s) { redis[n] = function(keys, argv, callback) {
        var args = [];
        args.push(s, keys.length || 0);
        args = args.concat(keys, argv || callback, callback || null);
        //console.log('args: ' + JSON.stringify(args));
        redis.eval.apply(redis, args);
      };})(script);
    }
  }
  return redis;
};

function sizeOfRedisInstance() {
  return _config.redis.master.length;
}

function parseInstanceIndex(aid) {
  // console.log('parseInstanceIndex(aid=' + aid + ')');
  // check extra instance
  if (aid == null) {
    return sizeOfRedisInstance() - 1;
  }
  // var index = _hash("sha1", aid) % _config.redis.master.length;
  // var hash = _crypto.createHash('sha1');
  // var hashed = hash.update(aid).digest('hex');
  // console.log('hashed ' + hashed + ', ' + parseInt(hashed, 16));
  // console.log('length ' + _config.redis.master.length);
  
  // var index = parseInt(hashed, 10) % (_config.redis.master.length);

  var indexString = aid.split('#');
  var index = parseInt(indexString[0]) - 1;
  // console.log('index ' + index);
  return index;
}

exports.store = function(aid) {
  var instanceIndex = parseInstanceIndex(aid);
  // console.log('redis aid: ' + aid + ', instance: ' + instanceIndex);

  if (_store.length == 0) {
    var size = sizeOfRedisInstance();
    // console.log('size of redis instance: ' + size);
    for (var i = 0; i < size; i++) {
      var config = _config.redis;
      var host = config.master[i].host;
      var port = config.master[i].port;
      // console.log('host: ' + host + ', port: ' + port);
      var redis = require('redis').createClient(port, host);
      redis.debug_mode = true;
      redis.on("error", function (err) {
        console.log("RedisError " + err);
      });
      var store = new Store(config.master[i].scripts_dir);
      _store.push(store.extend(redis));
    }
  }

  // console.log('store: ' + _store[instanceIndex]);
  // if (_store[instanceIndex] == null) {
  //     var config = require(__dirname + '/../config').redis;
  //     var redis = require('redis').createClient(config.port, config.host);
  //     redis.debug_mode = true;
  //     var store = new Store(config.scripts_dir);
  //     console.log(store);
  //     _store[instanceIndex] = store.extend(redis);
  //     init();
  // }
  return _store[instanceIndex];
}

function init() {
}
