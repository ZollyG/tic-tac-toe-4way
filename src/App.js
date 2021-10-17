import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import {
  checkVertical,
  checkHorizontal,
  checkPrimaryDiagonals,
  checkSecondaryDiagonals,
} from "./winLogic";
import "./App.css";

let played = false;
let currBoard = {};

function App() {
  initializeApp({
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
  let [xWins, setXWins] = useState(0);
  let [oWins, setOWins] = useState(0);

  let db = getFirestore();
  let nextPlayer = { X: "O", O: "X" };

  useEffect(() => {
    let db = getFirestore();
    onSnapshot(doc(db, "boardData", "board"), (doc) => {
      let x = doc.data();
      let newBoard = new Array(10).fill().map(() => new Array(10).fill(""));

      let changed = false;
      console.log(currBoard, x);
      for (let i in x) {
        newBoard[i[0]][i[1]] = x[i];
        if (!(i in currBoard)) {
          changed = true;

          currBoard[i] = x[i];
        }
      }
      if (changed) {
        played = false;
      }
      setBoard(newBoard);
    });
    onSnapshot(doc(db, "boardData", "gameData"), async (thing) => {
      let x = thing.data();
      setCurrentPlayer(x.player);
      setGameState(x.gameStatus);
      setXWins(x.xWins);
      setOWins(x.oWins);
      if (x.isReset) {
        await setDoc(doc(db, "boardData", "gameData"), {
          player: "X",
          gameStatus: "Tic-Tac-Toe",
          isReset: false,
          xWins: x.xWins,
          oWins: x.oWins,
        });

        window.location.reload(false);
      }
    });
  }, []);

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
    if (gameState !== "Tic-Tac-Toe" || played) {
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
    currBoard[String(i) + String(j)] = currentPlayer;
    console.log(currBoard);
    played = true;
    if (checkForWin(currentPlayer, newBoard)) {
      setGameState("Player " + currentPlayer + " wins!");
      if (currentPlayer === "X") {
        await setDoc(doc(db, "boardData", "gameData"), {
          player: nextPlayer[currentPlayer],
          gameStatus: "Player " + currentPlayer + " wins!",
          xWins: xWins + 1,
          oWins: oWins,
        });
      } else {
        await setDoc(doc(db, "boardData", "gameData"), {
          player: nextPlayer[currentPlayer],
          gameStatus: "Player " + currentPlayer + " wins!",
          xWins: xWins,
          oWins: oWins + 1,
        });
      }

      await setData(currentPlayer, i, j);
      return;
    }
    await setData(currentPlayer, i, j);
    await setDoc(doc(db, "boardData", "gameData"), {
      player: nextPlayer[currentPlayer],
      gameStatus: gameState,
      xWins: xWins,
      oWins: oWins,
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

  async function resetGame() {
    await setDoc(doc(db, "boardData", "board"), {});
    await setDoc(doc(db, "boardData", "gameData"), {
      player: "X",
      gameStatus: "Tic-Tac-Toe",
      isReset: true,
      xWins: xWins,
      oWins: oWins,
    });

    return;
  }

  return (
    <div className="App">
      <p>{gameState}</p>
      <p>
        <div>Current player: {currentPlayer}</div>
        <div>
          <div>X wins: {xWins}</div>
          <div>O wins: {oWins}</div>
        </div>
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
