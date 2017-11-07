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
io.on('connection', function(socket) {
  /* Listen for incoming chat messages */
  socket.on('move', function(obj) {
    /* Emit the message to all connections */
    /* cheat sheet  - https://stackoverflow.com/a/10099325 */
    socket.broadcast.emit('move', obj);
    console.log(obj);
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
