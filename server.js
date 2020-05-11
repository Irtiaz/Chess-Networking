const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
app.use(express.static('public'));

server.listen(PORT, () => console.log('Server is running!'));

const io = require('socket.io')(server);
const Room = require('./Room.js');

let rooms = [];
let counter = 0;

io.on('connection', socket => {
  admit(socket);

  socket.on('mouseEvent', ij => {
    let room = getRoom(socket);
    room.clickedOn(ij.i, ij.j);
  });

  socket.on('disconnect', () => {
    let room = getRoom(socket);
    room.remove(socket);
  });
});


function admit(socket) {
  for (let i = rooms.length - 1; i >= 0; i--) {
    if (rooms[i].members.length == 0) rooms.splice(i, 1);
  }

  let admitted = false;
  for (let room of rooms) {
    if (!room.started) {
      room.add(socket);
      admitted = true;
      break;
    }
  }
  if (!admitted) {
    const room = new Room('room' + counter);
    rooms.push(room);
    room.add(socket);
    counter++;
  }
}

function getRoom(socket) {
  for (let room of rooms) {
    if (room.has(socket)) return room;
  }
}