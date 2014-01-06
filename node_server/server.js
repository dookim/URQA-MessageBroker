'use strict';

var cluster = require('cluster');
if (cluster.isMaster) {
    require('os').cpus().forEach(function() {
        cluster.fork();
    });

    cluster.on('online', function(worker) {
        console.log('worker ' + worker.process.pid + ' is being executed.');
    });

    cluster.on('exit', function(worker, code, signal) {
        var exitCode = worker.process.exitCode;
        console.log('worker ' + worker.process.pid + ' died ('+exitCode+'). restarting...');
        // cluster.fork();
        // console.log('worker ' + worker.process.pid + ' died');
        // cluster.fork();
    });
} else {
    require('./app');
}
