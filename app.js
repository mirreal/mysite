var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server : server});

var clientsList = [];
var colors = ["#C03", "DarkKhaki", "yellow", "grey", "pink",
  "green", "orange", "brown", "Magenta", "DeepSkyBlue", 'purple', 'plum'];

colors.sort(function(a,b) {
  return Math.random() > 0.5;
});


wss.on('connection', function(client) {
  clientsList.push(client);
  var userName = false;
  var userColor = false;

  client.on('message', function(msg) {
    if(!userName) {
        userName = msg;
        userColor = colors.shift();
        client.send(JSON.stringify({
          type:'color',
          data: userColor
        }));

        console.log(userName + ' login');
    } else {
        console.log(userName + ' say: ' + msg);

        var obj = {
          time: (new Date()).getTime(),
          text: msg,
          author: userName,
          color: userColor
        };

        var json = JSON.stringify({
          type:'message',
          data: obj
        });

        for (var i=0; i < clientsList.length; i++) {
          if (client !== clientsList[i]) {
            clientsList[i].send(json);
          }
          //clientsList[i].send(json);
        }
    }
  });

  client.on('close', function() {
    var index = clientsList.indexOf(client);
    clientsList.splice(index, 1);
    if(userName != false && userColor != false) {
      colors.push(userColor);
    }  
  });
  
});

// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.sendfile('views/chat.html');
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
