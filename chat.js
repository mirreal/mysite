var express = require('express')
  , http = require('http')
  , path = require('path')
  , sio = require('socket.io');

//create app
var app = express();
var server = http.createServer(app);
var io = sio.listen(server);

app.use(express.bodyParser());

app.listen(3000);




io.sockets.on('connection', function(socket) {
  console.log('someone connected.');
})

app.get('/', function(req, res) {
  res.sendfile('view/index.html');
});