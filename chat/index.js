var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* Return the HTML page for requests to / */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
/* Set the static files to public */
app.use(express.static('public'));

/* Socket IO connection */
io.on('connection', function(socket){
  /* When a user is connected send them all previous messages */
  messages.forEach(function (obj) {
    socket.emit('chat message', obj);
  })

  /* Listen for incoming chat messages */
  socket.on('chat message', function(obj){
    /* Emit the message to all connections */
    io.emit('chat message', obj);
    /* Add message to history */
    messages.push(obj);
  });
  /* Listen for any disconnections */
  socket.on('disconnect', function(){
    console.log('user disconnected');
  })
});

/* Set up server on port 3000 */
http.listen(3000, function(){
  console.log('listening on *:3000');
});

let messages = [];
