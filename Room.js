const Chess = require('./Chess.js');

class Room {
  constructor(name) {
    this.name = name;
    this.members = [];

    this.started = false;
  }

  add(socket) {
    this.members.push(socket);
    socket.join(this.name);
    console.log(socket.id + ' has joined in ' + this.name);

    if (this.members.length == 2) {

      this.started = true;
      this.chess = new Chess();
      this.members[0].emit('started', {
        chess: this.chess,
        role: 'white'
      });
      this.members[1].emit('started', {
        chess: this.chess,
        role: 'black'
      });
    }
  }

  has(socket) {
    for (let member of this.members) {
      if (member.id == socket.id) return true;
    }
    return false;
  }

  remove(socket) {
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i];
      if (member.id == socket.id) {
        this.members.splice(i, 1);
        break;
      }
    }

    console.log(socket.id + ' has left from ' + this.name);

  	if (this.members.length > 0) this.members[0].emit('left');
  }

  clickedOn(i, j) {
    this.chess.clickedOn(i, j);
    this.members[0].emit('update', this.chess);
    this.members[1].emit('update', this.chess)
  }
}

module.exports = Room;
