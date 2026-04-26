// ...existing code...
// Simple Tic-Tac-Toe logic with single/multi player + basic bot

const boxes = Array.from(document.querySelectorAll('.box'));
const msgContainer = document.querySelector('.msg-container');
const msgText = document.getElementById('msg');
const newBtn = document.getElementById('new-btn');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const playAsRadios = document.querySelectorAll('input[name="play-as"]');
const singleOptions = document.getElementById('single-options');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let mode = 'multi'; // 'multi' | 'single'
let human = 'X';
let bot = 'O';

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function showMsg(text){
  msgText.textContent = text;
  msgContainer.classList.remove('hide');
}
function hideMsg(){ msgContainer.classList.add('hide'); }

function startGame(){
  mode = document.querySelector('input[name="mode"]:checked').value;
  human = document.querySelector('input[name="play-as"]:checked')?.value || 'X';
  bot = human === 'X' ? 'O' : 'X';
  resetBoard();
  // If single and human is O, bot (X) starts
  currentPlayer = 'X';
  if(mode === 'single' && currentPlayer === bot){
    window.setTimeout(botMove, 420);
  }
}

function resetBoard(){
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = 'X';
  hideMsg();
  boxes.forEach(b=>{
    b.textContent = '';
    b.classList.remove('x','o','win');
    b.disabled = false;
  });
}

function handleClick(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(gameOver) return;
  // in single mode, ignore clicks when it's bot turn
  if(mode === 'single' && currentPlayer === bot) return;
  if(board[idx]) return;
  makeMove(idx, currentPlayer);
}

function makeMove(idx, player){
  board[idx] = player;
  const el = boxes[idx];
  el.textContent = player;
  el.classList.add(player.toLowerCase());
  // check win
  const winInfo = checkWin(board, player);
  if(winInfo){
    gameOver = true;
    winInfo.line.forEach(i => boxes[i].classList.add('win'));
    showMsg(`${player} wins!`);
    return;
  }
  if(board.every(Boolean)){
    gameOver = true;
    showMsg(`It's a draw`);
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if(mode === 'single' && currentPlayer === bot){
    window.setTimeout(botMove, 420);
  }
}

function checkWin(bd, player){
  for(const line of wins){
    if(line.every(i => bd[i] === player)) return { player, line };
  }
  return null;
}

function botMove(){
  if(gameOver) return;
  // choose index
  const idx = chooseBotMove();
  if(idx == null) return;
  makeMove(idx, bot);
}

function chooseBotMove(){
  const avail = board.map((v,i)=> v ? null : i).filter(v=>v!=null);
  // 1) Win if possible
  for(const i of avail){
    const copy = board.slice();
    copy[i] = bot;
    if(checkWin(copy, bot)) return i;
  }
  // 2) Block opponent
  for(const i of avail){
    const copy = board.slice();
    copy[i] = human;
    if(checkWin(copy, human)) return i;
  }
  // 3) Take center
  if(avail.includes(4)) return 4;
  // 4) Take a corner
  const corners = [0,2,6,8].filter(i=>avail.includes(i));
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  // 5) Else random side
  if(avail.length) return avail[Math.floor(Math.random()*avail.length)];
  return null;
}

// UI helpers for mode toggle
modeRadios.forEach(r=>{
  r.addEventListener('change', e=>{
    if(e.target.value === 'single') singleOptions.classList.remove('hide');
    else singleOptions.classList.add('hide');
  });
});

boxes.forEach(b => b.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetBoard);
startBtn.addEventListener('click', startGame);
newBtn.addEventListener('click', startGame);

// initialize
startGame();
// ...existing code...