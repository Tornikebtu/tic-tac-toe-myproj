// Initialize variables
let currentPlayer = '';
let moves = 0;
let gameActive = false;

// Get DOM elements
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const matchCounter = document.getElementById('match-counter');

// Game board
const board = ['','','','','','','','',''];

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Add event listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Function to start the game
function startGame() {
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = `Current Player: ${currentPlayer}`;
  matchCounter.textContent = Number(localStorage.getItem('matchCount') || 0) + 1;

  startButton.style.display = 'none';
  resetButton.style.display = 'block';

  // Add event listeners to cells
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
}
// Function to handle a cell click
function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = parseInt(cell.getAttribute('data-cell-index'));

  if (board[cellIndex] !== '' || !gameActive) return;

  board[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
  
  moves++;
  if (checkWin()) {
    endGame(false);
    return;
  } else if (moves === 9) {
    endGame(true);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `Current Player: ${currentPlayer}`;
}


// Function to check for a win
function checkWin() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}


// Function to end the game
function endGame(isTie) {
  gameActive = false;
  if (isTie) {
    winnertieDisplay.classList.add('winnertie');
    winnertieDisplay.textContent = "It's a tie!";
  } else {
    winnerDisplay.classList.add('winner');
    winnerDisplay.textContent = `Player ${currentPlayer} wins!`;
  }

  resetButton.style.display = 'block';
  // Remove event listeners from cells
  cells.forEach(cell => cell.removeEventListener('click', handleCellClick));

  // Add CSS class to winnerDisplay element

  resetButton.addEventListener('click', resetGame);

  localStorage.setItem('matchCount', matchCounter.textContent);
}


// Function to start the next game directly
function startNextGame() {
  resetGame();
  startGame();
}


// Function to reset the game
function resetGame() {
  currentPlayer = '';
  moves = 0;
  gameActive = false;
  statusDisplay.textContent = '';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
    cell.removeEventListener('click', handleCellClick);
  });

  resetButton.style.display = 'none';
  startButton.style.display = 'block';

  // Remove CSS class from winnerDisplay element
  winnerDisplay.classList.remove('winner');
  winnerDisplay.textContent = ''
  winnertieDisplay.classList.remove('winnertie');
  winnertieDisplay.textContent = ''

  // Remove event listener from start button
  startButton.removeEventListener('click', startGame);

  // Add event listener to start button
  startButton.addEventListener('click', startGame);
}

// Clear match counter when page refreshes
window.onbeforeunload = function() {
  localStorage.removeItem('matchCount');
};

// Initialize the match counter
matchCounter.textContent = localStorage.getItem('matchCount') || 0;

// Add event listener to the start button
startButton.addEventListener('click', startGame);

// Add event listener to the reset button
resetButton.addEventListener('click', resetGame);