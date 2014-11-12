/*var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
*/

/*var express = require("express");
var app = express();
app.use(function(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('<html><body>Hello World</body></html>\n');
}).listen(3000)*/

/*var net = require("net");
var server = net.createServer(function(socket){
    socket.on("data", function(data){
        socket.write("你好！");
    });
    socket.on("end", function(){
        console.log("连接断开")
    });
    socket.write("hello world!")
});
server.listen(8124, function(){
    console.log("server bound")
})*/


var dgram = require("dgram");
var server = dgram.createSocket("udp4");
server.on("message", function(msg, rinfo){
    console.log("server got:" + msg + "from" + rinfo.address + ":" + rinfo.port);
});
server.on("listening", function(){
    var address = server.address(); 
    console.log("server listening" + address.address + ":" + address.port);
});

var message = new Buffer("aaaa");
server.send(message, 0, message.length, 41234, "localhost", function(err, bytes){
    server.close();
})
//server.bind(41234);
