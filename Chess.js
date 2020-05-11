const {
  getPiece,
  outOfBound,
  has,
  getKing,
  removeTroop,
  willBeCheckedIf,
  updateCheckState
} = require('./Helper.js');

const Piece = require('./Piece.js');

const troopNames = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];

function setupWhite() {
  let whites = [];

  for (let j = 0; j < 8; j++) {
    whites.push(new Piece(6, j, 'pawn', 'white'));
  }

  for (let j = 0; j < 5; j++) {
    whites.push(new Piece(7, j, troopNames[j], 'white'));
    if (j < 3) {
      whites.push(new Piece(7, 7 - j, troopNames[j], 'white'));
    }
  }

  return whites;
}

function setupBlack() {
  let blacks = [];

  for (let j = 0; j < 8; j++) {
    blacks.push(new Piece(1, j, 'pawn', 'black'));
  }

  for (let j = 0; j < 5; j++) {
    blacks.push(new Piece(0, j, troopNames[j], 'black'));
    if (j < 3) {
      blacks.push(new Piece(0, 7 - j, troopNames[j], 'black'));
    }
  }

  return blacks;
}

const notChecked = -1;
const checked = 0;
const checkMated = 1;

class Chess {
  constructor() {
    this.whites = setupWhite();
    this.blacks = setupBlack();
    this.selected = null;
    this.turn = 'white';

    this.wCheckState = notChecked;
    this.bCheckState = notChecked;
  }


  king(team) {
    return getKing(team, this.whites, this.blacks);
  }

  pieceAt(i, j) {
    return getPiece(i, j, this.whites, this.blacks);
  }

  clickedOn(i, j) {
    if (this.selected == null) {
      let t = getPiece(i, j, this.whites, this.blacks);
      if (t != null && t.team == this.turn) {
        this.selected = t;
        this.selected.findPossibleMoves(true, this.whites, this.blacks);
      }
    } else {
      if (this.selected.i != i || this.selected.j != j) {
        if (this.selected.move(i, j, this.whites, this.blacks)) {
          this.turn = this.turn == 'white' ? 'black' : 'white';

          this.wCheckState = updateCheckState('white', this.whites, this.blacks);
          this.bCheckState = updateCheckState('black', this.whites, this.blacks);
        }
        this.selected = null;
      }
    }
  }
}

module.exports = Chess;
