function checkVertical(player, board) {
  let winCount = 0;
  for (let i = 0; i < board.length; i++) {
    winCount = 0;
    for (let j = 0; j < board.length; j++) {
      winCount = board[j][i] === player ? winCount + 1 : 0;
      if (winCount === 5) {
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
      winCount = board[i][j] === player ? winCount + 1 : 0;
      if (winCount === 5) {
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
      winCount = board[i][j] === player ? winCount + 1 : 0;
      if (winCount === 5) {
        return true;
      }
    }
  }

  //bottom half
  for (let k = board.length - 2; k >= 0; k--) {
    winCount = 0;
    for (let j = 0; j <= k; j++) {
      let i = k - j;
      winCount = board[i][j] === player ? winCount + 1 : 0;
      if (winCount === 5) {
        return true;
      }
    }
  }

  return false;
}

function checkSecondaryDiagonals(player, board) {
  let winCount = 0;

  for (let k = board.length - 1; k >= 0; k--) {
    winCount = 0;
    for (let j = board.length - 1; j >= k; j--) {
      let i = j - k;
      winCount = board[i][j] === player ? winCount + 1 : 0;
      if (winCount === 5) {
        return true;
      }
    }
  }

  for (let k = 0; k < board.length - 1; k++) {
    winCount = 0;
    for (let j = board.length - 1; j >= k; j--) {
      let i = j - k;
      winCount = board[j][i] === player ? winCount + 1 : 0;
      if (winCount === 5) {
        return true;
      }
    }
  }

  return false;
}

export { checkVertical, checkHorizontal, checkPrimaryDiagonals, checkSecondaryDiagonals };
