let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let moves = [];

/* Return the index HTML page for requests to / */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});
/* Routing to the game HTML page for requests to /path/x */
app.get(['/play/:id','/play/'], function(req, res) {
  res.sendFile(__dirname + '/static/game.html');
});
/* Set the static files */
app.use(express.static('static'));
/* 404 route for anything else */
app.get('*', function(req, res){
  res.status(404).send('what???');
});

/* Socket IO connection */
/* cheat sheet  - https://stackoverflow.com/a/10099325 */
io.on('connection', function(socket) {
  /* On conection send all moves since last reset */
  socket.emit('init',moves);

  /* Listen for incoming moves */
  socket.on('move', function(obj) {
    moves.push(['move', obj]);
    /* Emit the message to all connections */
    io.emit('move', obj);
  });
  /* Listen for incoming resets */
  socket.on('reset', function() {
    moves = [['reset']];
    /* Emit the message to all connections */
    io.emit('reset');
  });
  /* Listen for incoming sets */
  socket.on('set', function(obj) {
    moves.push(['set', obj]);
    /* Emit the message to all connections */
    io.emit('set', obj);
  });
  /* Listen for incoming flips */
  socket.on('flip', function(obj) {
    moves.push(['flip', obj]);
    /* Emit the message to all connections */
    io.emit('flip', obj);
  });
  /* Listen for incoming sorts */
  socket.on('sort', function(obj) {
    moves.push(['sort', obj]);
    /* Emit the message to all connections */
    io.emit('sort', obj);
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
