const socket = io();

/* Listen for message sending from form */
document.getElementById('send-message').addEventListener('submit', function (e) {
  /* Create object to send over socket */
  const obj = new Object();
  obj.message = document.getElementById('message').value;
  obj.from = document.getElementById('user').value;
  /* Send over socket */
  socket.emit('chat message',obj);
  /* Clear form */
  document.getElementById('message').value = '';
  /* Prevent normal form handling */
  e.preventDefault();
  return false;
});

/* Listen for chat messages over the socket */
socket.on('chat message', function(msg) {
  /* Create element for the incoming message */
  const e_li = document.createElement('li');
  const e_sp = document.createElement('span');
  e_sp.appendChild(document.createTextNode(msg.from + ': '));
  e_li.appendChild(e_sp);
  e_li.appendChild(document.createTextNode(msg.message));
  /* Add element to the document */
  document.getElementById('messages').appendChild(e_li);
});