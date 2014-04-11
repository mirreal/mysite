var net = require('net')

var chatServer = net.createServer(),
	clientList = [];

chatServer.listen(9000);

chatServer.on('connection', function(client) {
	client.name = client.remoteAddress + ':' +  client.remotePort
	client.write('Hi ' + client.name + '!\n');
	console.log(client.name + 'joined')

	clientList.push(client)

	client.on('data', function(data) {
    console.log(client.name + ' says ' + data)
		boardcast(data, client)
	})
	
	client.on('end', function() {
		clientList.splice(clientList.indexOf(client), 1)
	})

	client.on('error', function() {
		console.log(error)
	})
})

function boardcast(message, client) {
  var cleanup = []
  for (var i = 0; i < clientList.length; i+=1) {
     if (client !== clientList[i]) {

        if (clientList[i].writable) {
           clientList[i].write(client.name + " says " + message)
        } else {
           cleanup.push(clientList[i])
           clientList[i].destory()
        }
      }         
  }
  for (i = 0; i < cleanup.length; i++) {
    clientList.splice(clientList.indexOf(cleanup[i]), 1)
  }
}

