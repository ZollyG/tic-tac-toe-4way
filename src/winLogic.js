function checkVertical(player, board) {
  let winCount = 0;
  for (let i = 0; i < board.length; i++) {
    winCount = 0;
    for (let j = 0; j < board.length; j++) {
      if (board[j][i] === player) {
        winCount++;
      }
      if (winCount === 4) {
        return true;
      }
    }
  }
  return false;
}

function checkHorizontal(player, board) {
  let winCount = 0;
  for (let i = 0; i < board.length; i++) {
    winCount = 0;
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === player) {
        winCount++;
      }
      if (winCount === 4) {
        return true;
      }
    }
  }
  return false;
}

function checkPrimaryDiagonals(player, board) {
  let winCount = 0;

  //check for constant sum per batch diagonal

  //top half
  for (let k = 0; k < board.length; k++) {
    winCount = 0;
    for (let j = 0; j <= k; j++) {
      let i = k - j;
      if (board[i][j] === player) {
        winCount++;
      }
      if (winCount === 4) {
        return true;
      }
    }
  }

  //bottom half
  for (let k = board.length - 2; k >= 0; k--) {
    winCount = 0;
    for (let j = 0; j <= k; j++) {
      let i = k - j;
      if (board[i][j] === player) {
        winCount++;
      }
      if (winCount === 4) {
        return true;
      }
    }
  }

  return false;
}

function checkSecondaryDiagonals(player, board) {
  let dummyBoard = new Array(board.length)
    .fill()
    .map(() => new Array(board.length).fill(""));

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      dummyBoard[i][j] = board[i][j];
    }
  }

  for (let thing of dummyBoard) {
    thing = thing.reverse();
  }

  return checkPrimaryDiagonals(player, dummyBoard);
}

export { checkVertical, checkHorizontal, checkPrimaryDiagonals, checkSecondaryDiagonals };
