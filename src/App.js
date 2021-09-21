import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyBVBFjUVdl3t2iAYmmzKFOZ-AM84CyntrQ",
    authDomain: "tic-tac-toe-4way.firebaseapp.com",
    projectId: "tic-tac-toe-4way",
    storageBucket: "tic-tac-toe-4way.appspot.com",
    messagingSenderId: "179858458145",
    appId: "1:179858458145:web:c01a19c3f05023ca084560",
    measurementId: "G-S1GJ4YB8BM",
  });

  let [board, setBoard] = useState([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);

  let [gameState, setGameState] = useState("");
  let [currentPlayer, setCurrentPlayer] = useState("");

  let db = getFirestore();
  let nextPlayer = { X: "O", O: "X" };

  useEffect(() => {
    async function initialUpdate() {
      let updateData = await getDoc(doc(db, "boardData", "gameData"));
      updateData = updateData.data();
      setCurrentPlayer(updateData.player);
      setGameState(updateData.gameStatus);
    }
    initialUpdate();
  }, []);

  useEffect(() => {
    setTimeout(async function () {
      let x = await getData();
      x = x.data();
      let newBoard = new Array(board.length)
        .fill()
        .map(() => new Array(board.length).fill(""));
      for (let i in x) {
        newBoard[i[0]][i[1]] = x[i];
      }
      setBoard(newBoard);
      x = await getDoc(doc(db, "boardData", "gameData"));
      x = x.data();
      setCurrentPlayer(x.player);
      setGameState(x.gameStatus);
    }, 4000);
  });

  async function setData(dummy, i, j) {
    let x = await getData();
    x = x.data();
    x[String(i) + String(j)] = dummy;
    await setDoc(doc(db, "boardData", "board"), x);
  }

  function generateBoard() {
    let cellArray = [];
    for (let i = 0; i <= 9; i++) {
      cellArray.push(<div className="Line">{generateLine(i)}</div>);
    }

    return cellArray;
  }

  function generateLine(i) {
    let result = [];
    for (let j = 0; j <= 9; j++) {
      result.push(
        <div
          onClick={() => {
            fill(i, j);
          }}
          className="PlayBox"
        >
          {board[i][j]}
        </div>
      );
    }

    return result;
  }

  async function fill(i, j) {
    if (gameState !== "Tic-Tac-Toe") {
      return;
    }
    let newBoard = new Array(board.length)
      .fill()
      .map(() => new Array(board.length).fill(""));
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        newBoard[i][j] = board[i][j];
      }
    }

    newBoard[i][j] = currentPlayer;
    setBoard(newBoard);
    if (checkForWin(currentPlayer, newBoard)) {
      setGameState("Player " + currentPlayer + " wins!");
      await setDoc(doc(db, "boardData", "gameData"), {
        player: nextPlayer[currentPlayer],
        gameStatus: "Player " + currentPlayer + " wins!",
      });
      await setData(currentPlayer, i, j);
      return;
    }
    await setData(currentPlayer, i, j);
    await setDoc(doc(db, "boardData", "gameData"), {
      player: nextPlayer[currentPlayer],
      gameStatus: gameState,
    });
  }

  async function getData() {
    try {
      return await getDoc(doc(db, "boardData", "board"));
    } catch (e) {
      console.error(e);
    }
  }

  function checkForWin(player, board) {
    if (
      checkVertical(player, board) ||
      checkHorizontal(player, board) ||
      checkPrimaryDiagonals(player, board) ||
      checkSecondaryDiagonals(player, board)
    ) {
      return true;
    }
    return false;
  }

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

  async function resetGame() {
    await setDoc(doc(db, "boardData", "board"), {});
    await setDoc(doc(db, "boardData", "gameData"), {
      player: "X",
      gameStatus: "Tic-Tac-Toe",
    });
    return;
  }

  return (
    <div className="App">
      <p>{gameState}</p>
      <p>
        <div>Current player: {currentPlayer}</div>
        <button
          onClick={() => {
            resetGame();
          }}
        >
          Reset Game
        </button>
      </p>

      <div className="GameContainer">{generateBoard()}</div>
    </div>
  );
}

export default App;