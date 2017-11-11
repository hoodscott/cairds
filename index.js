var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/* Return the HTML page for requests to / */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/game.html');
});

/* Set the static files */
app.use(express.static('static'));

/* Socket IO connection */
/* cheat sheet  - https://stackoverflow.com/a/10099325 */
io.on('connection', function(socket) {
  /* Listen for incoming moves */
  socket.on('move', function(obj) {
    /* Emit the message to all connections */
    io.emit('move', obj);
  });
  /* Listen for incoming resets */
  socket.on('reset', function() {
    /* Emit the message to all connections */
    io.emit('reset');
  });
  /* Listen for incoming sets */
  socket.on('set', function(obj) {
    /* Emit the message to all connections */
    io.emit('set', obj);
  });
  /* Listen for incoming flips */
  socket.on('flip', function(obj) {
    /* Emit the message to all connections */
    io.emit('flip', obj);
  });
  /* Listen for any disconnections */
  socket.on('disconnect', function() {
    console.log('user disconnected');
  })
});

/* Set up server on port 3000 */
http.listen(3000, function() {
  console.log('listening on *:3000');
});
