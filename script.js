const board = document.getElementById("board");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const drawScore = document.getElementById("drawScore"); // Add a draw counter element
const roundCounter = document.getElementById("roundCounter"); // Add round display element
const modeSelect = document.getElementById("modeSelect"); // Select PvP or PvC

const modal = document.getElementById("nameModal");
const startGameBtn = document.getElementById("startGameBtn");

let player1Name = "Player 1 (X)";
let player2Name = "Player 2 (O)";
let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0, Draws: 0 };
let totalRounds = 3; // Default Best of 3
let currentRound = 1;
let gameMode = "PvP"; // Default Player vs Player

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Initialize board
function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  status.textContent = `${player1Name}'s turn (X)`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
  updateRoundDisplay();
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  playMove(cell, index, currentPlayer);

  if (gameMode === "PvC" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 300); // small delay for AI
  }
}

function playMove(cell, index, player) {
  gameState[index] = player;
  cell.textContent = player;
  cell.classList.add("taken");

  checkResult();
}

// Check result
function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    const winnerName = currentPlayer === "X" ? player1Name : player2Name;
    status.textContent = `${winnerName} wins round ${currentRound}! 🎉`;
    scores[currentPlayer]++;
    gameActive = false;
    updateScoreboard();
    setTimeout(nextRoundOrEnd, 1000);
    return;
  }

  if (!gameState.includes("")) {
    status.textContent = `It's a draw! 🤝`;
    scores.Draws++;
    gameActive = false;
    updateScoreboard();
    setTimeout(nextRoundOrEnd, 1000);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `${currentPlayer === "X" ? player1Name : player2Name}'s turn (${currentPlayer})`;
}

// AI Move (Easy Random)
function aiMove() {
  const emptyCells = Array.from(document.querySelectorAll('.cell')).filter(c => !c.classList.contains('taken'));
  if (emptyCells.length === 0) return;
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  playMove(randomCell, randomCell.dataset.index, "O");
}

// Update Scoreboard
function updateScoreboard() {
  score1.textContent = `${player1Name}: ${scores["X"]}`;
  score2.textContent = `${player2Name}: ${scores["O"]}`;
  drawScore.textContent = `Draws: ${scores.Draws}`;
}

// Handle rounds
function nextRoundOrEnd() {
  if (currentRound < totalRounds) {
    currentRound++;
    createBoard();
  } else {
    declareOverallWinner();
  }
}

function declareOverallWinner() {
  let winnerText;
  if (scores.X > scores.O) winnerText = `${player1Name} wins the series! 🏆`;
  else if (scores.O > scores.X) winnerText = `${player2Name} wins the series! 🏆`;
  else winnerText = `The series ends in a draw! 🤝`;

  status.textContent = winnerText;
  gameActive = false;
}

// Update Round Display
function updateRoundDisplay() {
  if (roundCounter) {
    roundCounter.textContent = `Round: ${currentRound} / ${totalRounds}`;
  }
}

// Reset Game manually
resetBtn.addEventListener("click", () => {
  scores = { X: 0, O: 0, Draws: 0 };
  currentRound = 1;
  createBoard();
  updateScoreboard();
});

// Modal Logic
startGameBtn.addEventListener("click", () => {
  player1Name = player1NameInput.value.trim() || "Player 1 (X)";
  
  gameMode = modeSelect.value;

  if (gameMode === "PvC") {
    player2Name = "Computer";
    player2NameInput.value = "Computer"; // show in input field
    player2NameInput.disabled = true; // disable editing
  } else {
    player2Name = player2NameInput.value.trim() || "Player 2 (O)";
    player2NameInput.disabled = false; // enable editing
  }

  totalRounds = parseInt(document.getElementById("totalRounds").value) || 3;

  updateScoreboard();
  createBoard();
  modal.style.display = "none";
});

