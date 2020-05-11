// function pieceWithMouseOn(teamName, mouseX, mouseY, whites, blacks) {
//   let resultPiece = null;

//   let team = teamName == 'white' ? whites : blacks;

//   for (let troop of team) {
//     if (troop.mouseOn(mouseX, mouseY)) {
//       resultPiece = troop;
//       break;
//     }
//   }
//   return resultPiece;
// }

function getPiece(i, j, whites, blacks) {
  // console.log(`Gotta get a piece at ${i},${j}`);
  // console.log(whites, blacks);
  for (let whiteTroop of whites) {
    if (whiteTroop.i == i && whiteTroop.j == j) {
      return whiteTroop;
    }
  }
  for (let blackTroop of blacks) {
    if (blackTroop.i == i && blackTroop.j == j) {
      return blackTroop;
    }
  }

  return null;
}

function outOfBound(i, j) {
  return i < 0 || i > 7 || j < 0 || j > 7;
}

function has(arr2d, arr) {
  for (let a of arr2d) {
    if (a[0] == arr[0] && a[1] == arr[1]) return true;
  }
  return false;
}

function getKing(team, whites, blacks) {
  let troops = team == 'white' ? whites : blacks;
  for (let troop of troops) {
    if (troop.type == 'king') return troop;
  }
}

function removeTroop(troop, whites, blacks) {
  let team = troop.team == 'white' ? whites : blacks;
  let index = team.indexOf(troop);
  team.splice(index, 1);
}


function willBeCheckedIf(troop, i, j, whites, blacks) {
  let pi = troop.i;
  let pj = troop.j;
  let replacedTroop = (pi == i && pj == j) ? null : getPiece(i, j, whites, blacks);
  if (replacedTroop != null && replacedTroop.team != troop.team) removeTroop(replacedTroop, whites, blacks);
  troop.place(i, j);

  let opponent = troop.team == 'white' ? blacks : whites;
  let king = getKing(troop.team, whites, blacks);
  for (let opp of opponent) {
    if (opp.canCapture(king.i, king.j, whites, blacks)) {
      troop.place(pi, pj);
      if (replacedTroop != null) opponent.push(replacedTroop);
      return true;
    }
  }

  troop.place(pi, pj);
  if (replacedTroop != null) opponent.push(replacedTroop);

  return false;
}


function updateCheckState(team, whites, blacks) {
  let king = getKing(team, whites, blacks);
  let flag = willBeCheckedIf(king, king.i, king.j, whites, blacks);

  let answer = -1;

  if (flag) {
    answer = 0;
    // if (team == 'white') wCheckState = checked;
    // else bCheckState = checked;

    let troops = team == 'white' ? whites : blacks;
    let moves = 0;
    for (let troop of troops) {
      troop.findPossibleMoves(true, whites, blacks);
      moves += troop.possibleMoves.length;
    }

    if (moves == 0) {
      // if (team == 'white') wCheckState = checkMated;
      // else bCheckState = checkMated;
      answer = 1;
    }
  } else {
    // if (team == 'white') wCheckState = notChecked;
    // else bCheckState = notChecked;
    answer = -1;
  }

  // console.log(team, whites.length);

  return answer;
}

module.exports = {
  getPiece,
  outOfBound,
  has,
  getKing,
  removeTroop,
  willBeCheckedIf,
  updateCheckState
};