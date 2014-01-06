'use strict';
var gk = require('./common');
process.env.TZ = 'Asia/Seoul';

// express
var express = require('express');

//Midleware
var errorHandler = require('./middleware/error_handler');
//var updateStatsMidleware = require('./middleware/update_stats');
//var checkTokenMidleware  = require('./middleware/check_token');

// app
var app = express();
app.configure(function() {
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.compress());
    app.use(errorHandler());
    //app.use(checkTokenMidleware());
    //app.use(updateStatsMidleware());
});


// router
var router = require('./routes');
router.route(app);

app.listen(gk.config.port);
console.log("Server started at port " + gk.config.port);
