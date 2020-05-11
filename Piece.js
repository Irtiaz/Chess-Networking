const {
  getPiece,
  outOfBound,
  has,
  getKing,
  removeTroop,
  willBeCheckedIf,
  updateCheckState
} = require('./Helper.js');

class Piece {
  constructor(i, j, troopType, team) {
    this.i = i;
    this.j = j;
    this.type = troopType;
    this.team = team;

    const troopNames = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];

    if (team == 'white') {
      this.imageIndex = troopNames.indexOf(troopType) + 1;
    } else {
      this.imageIndex = troopNames.indexOf(troopType) + 1 + troopNames.length;
    }

    // this.x = this.j * w;
    // this.y = this.i * w;
  }

  // display() {
  //   image(this.image, this.x, this.y, w, w);
  // }

  // mouseOn(mouseX, mouseY) {
  //   return mouseX > this.x && mouseX < this.x + w &&
  //     mouseY > this.y && mouseY < this.y + w;
  // }


  findPossibleMoves(canHaveMistakes, whites, blacks) {
    let moves = [];
    let i = this.i;
    let j = this.j;

    switch (this.type) {
      case 'pawn':
        if (this.team == 'white' && i > 0) {
          if (getPiece(i - 1, j, whites, blacks) == null) moves.push([i - 1, j]);
          if (i == 6 && getPiece(4, j, whites, blacks) == null && getPiece(5, j, whites, blacks) == null) moves.push([i - 2, j]);
          let piece1 = getPiece(i - 1, j - 1, whites, blacks);
          let piece2 = getPiece(i - 1, j + 1, whites, blacks);
          if (piece1 != null && piece1.team == 'black') moves.push([i - 1, j - 1]);
          if (piece2 != null && piece2.team == 'black') moves.push([i - 1, j + 1]);

        } else if (i < 7) {
          if (getPiece(i + 1, j, whites, blacks) == null) moves.push([i + 1, j]);
          if (i == 1 && getPiece(3, j, whites, blacks) == null && getPiece(2, j, whites, blacks) == null) moves.push([i + 2, j]);
          let piece1 = getPiece(i + 1, j - 1, whites, blacks);
          let piece2 = getPiece(i + 1, j + 1, whites, blacks);
          if (piece1 != null && piece1.team == 'white') moves.push([i + 1, j - 1]);
          if (piece2 != null && piece2.team == 'white') moves.push([i + 1, j + 1]);
        }
        break;

      case 'rook':
        let d = [1, -1, 0, 0];
        for (let x = 0; x < d.length; x++) {
          let si = d[x];
          let sj = d[d.length - x - 1];
          for (let change = 1;; change++) {
            let di = i + si * change;
            let dj = j + sj * change;
            if (outOfBound(di, dj)) break;
            let piece = getPiece(di, dj, whites, blacks);
            if (piece == null) moves.push([di, dj]);
            else {
              if (piece.team != this.team) moves.push([di, dj]);
              break;
            }
          }
        }
        break;

      case 'knight':
        let moveI = [2, -2, 1, -1];
        for (let mi of moveI) {
          let moveJ = [];
          if (mi == 2 || mi == -2) moveJ.push(1, -1);
          else moveJ.push(2, -2);
          for (let mj of moveJ) {
            let di = i + mi;
            let dj = j + mj;
            if (outOfBound(di, dj)) continue;
            let piece = getPiece(di, dj, whites, blacks);
            if (piece == null) moves.push([di, dj]);
            else if (piece.team != this.team) moves.push([di, dj]);
          }
        }
        break;

      case 'bishop':
        let signs = [1, -1];

        for (let si of signs) {
          for (let sj of signs) {
            for (let d = 1;; d++) {
              let di = i + si * d;
              let dj = j + sj * d;
              if (outOfBound(di, dj)) break;
              let piece = getPiece(di, dj, whites, blacks);
              if (piece == null) moves.push([di, dj]);
              else {
                if (piece.team != this.team) moves.push([di, dj]);
                break;
              }
            }
          }
        }
        break;

      case 'queen':
        let c = [1, -1, 0, 0];
        for (let x = 0; x < c.length; x++) {
          let si = c[x];
          let sj = c[c.length - x - 1];
          for (let change = 1;; change++) {
            let di = i + si * change;
            let dj = j + sj * change;
            if (outOfBound(di, dj)) break;
            let piece = getPiece(di, dj, whites, blacks);
            if (piece == null) moves.push([di, dj]);
            else {
              if (piece.team != this.team) moves.push([di, dj]);
              break;
            }
          }
        }

        let sign = [1, -1];

        for (let si of sign) {
          for (let sj of sign) {
            for (let change = 1;; change++) {
              let di = i + si * change;
              let dj = j + sj * change;
              if (outOfBound(di, dj)) break;
              let piece = getPiece(di, dj, whites, blacks);
              if (piece == null) moves.push([di, dj]);
              else {
                if (piece.team != this.team) moves.push([di, dj]);
                break;
              }
            }
          }
        }
        break;

      case 'king':
        let arr = [1, -1, 0];
        for (let ci of arr) {
          for (let cj of arr) {
            let di = i + ci;
            let dj = j + cj;
            if (outOfBound(di, dj)) continue;
            let piece = getPiece(di, dj, whites, blacks);
            if (piece == null) {
              moves.push([di, dj]);
            } else if (piece.team != this.team) moves.push([di, dj]);
          }
        }
        break;
    }



    if (canHaveMistakes == true) {
      for (let i = moves.length - 1; i >= 0; i--) {
        let move = moves[i];
        if (willBeCheckedIf(this, move[0], move[1], whites, blacks)) moves.splice(i, 1);
      }
    }

    this.possibleMoves = moves;
  }


  move(di, dj, whites, blacks) {
    let canMove = has(this.possibleMoves, [di, dj]);

    if (canMove) {
      let attackedPiece = getPiece(di, dj, whites, blacks);
      if (attackedPiece != null && attackedPiece.type == 'king') return false;

      this.place(di, dj);

      if (attackedPiece != null) {
        removeTroop(attackedPiece, whites, blacks);
      }
    }

    return canMove;
  }

  canCapture(i, j, whites, blacks) {
    this.findPossibleMoves(false, whites, blacks);
    if (this.type == 'pawn') {
      if (this.team == 'white') {
        return this.i - i == 1 && abs(this.j - j) == 1;
      } else {
        return i - this.i == 1 && abs(this.j - j) == 1;
      }
    } else {
      return has(this.possibleMoves, [i, j]);
    }
  }

  place(i, j) {
    this.i = i;
    this.j = j;
    // this.x = this.j * w;
    // this.y = this.i * w;
  }
}

module.exports = Piece;