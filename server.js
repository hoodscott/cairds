let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const PORT = process.env.PORT || 3000
let sessions = {};

/* Return the index HTML page for requests to / */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});
/* Routing to the game HTML page for requests to /path/x */
app.get(['/play/:id','/play/'], function(req, res) {
  res.sendFile(__dirname + '/static/game.html');
});
/* Routing to the game HTML page for requests to /create/x */
app.get(['/create/:p'], function(req, res) {
  /* Random string */
  const id = Math.random().toString(36).slice(2);
  /* Create session object and add it to the global sessions holder */
  sessions[id] = {};
  sessions[id].params = JSON.parse(req.params.p);
  sessions[id].moves = [['reset']];
  /* Redirect to the play link */
  res.redirect('/play/' + id);
});
/* Set the static files */
app.use(express.static('static'));
/* 404 route for anything else */
app.get('*', function(req, res){
  res.status(404).send('404');
});

/* Socket IO connection */
/* cheat sheet  - https://stackoverflow.com/a/10099325 */
io.on('connection', function(socket) {
  let url = socket.request.headers.referer.split('/').slice(-1)[0];
  let session = sessions[url];
  if (!session) {
    session = {};
  }

  socket.on('room', function(room) {
    socket.join(room);
  });

  /* On connection send all moves since last reset */
  socket.emit('init',session);

  /* Listen for incoming moves */
  socket.on('move', function(obj) {
    session.moves.push(['move', obj]);
    /* Emit the message to all connections */
    io.sockets.in(url).emit('move', obj);
  });
  /* Listen for incoming resets */
  socket.on('reset', function() {
    session.moves = [['reset']];
    /* Emit the message to all connections */
    io.sockets.in(url).emit('reset');
  });
  /* Listen for incoming sets */
  socket.on('set', function(obj) {
    session.moves.push(['set', obj]);
    /* Emit the message to all connections */
    io.sockets.in(url).emit('set', obj);
  });
  /* Listen for incoming flips */
  socket.on('flip', function(obj) {
    session.moves.push(['flip', obj]);
    /* Emit the message to all connections */
    io.sockets.in(url).emit('flip', obj);
  });
  /* Listen for incoming sorts */
  socket.on('sort', function(obj) {
    session.moves.push(['sort', obj]);
    /* Emit the message to all connections */
    io.sockets.in(url).emit('sort', obj);
  });
  /* Listen for any disconnections */
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

/* Set up server on port 3000 */
http.listen(PORT, function() {
  console.log(`Listening on ${ PORT }`);
});
