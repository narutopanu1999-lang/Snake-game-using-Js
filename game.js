let board = document.querySelector('.board');
let col = 20;
let row = 20;
let minGridSize = 10;
let maxGridSize = 50;

let intervalId = null;
let timerIntervalId = null;
let gameRunning = false;
let gamePaused = true;
let score = 0;
let bestScore = localStorage.getItem('snakeBestScore') || 0;
let gameTime = 0;
let speed = 150;

let food = {x: Math.floor(Math.random()*col), y: Math.floor(Math.random()*row)};
let blocks = {};

let snake = [{x:10, y:10}];
let direction = 'left';
let nextDirection = 'left';

// Initialize best score
document.getElementById('bestScore').textContent = bestScore;

function createBoard() {
    board.innerHTML = '';
    blocks = {};
    board.style.setProperty('--grid-col', col);
    board.style.setProperty('--grid-row', row);
    
    for(let i = 0; i < row; i++){
       for(let j = 0; j < col; j++){
           const block = document.createElement('div');
           block.classList.add('block');
           board.appendChild(block);
           blocks[`${i},${j}`] = block;
       }
    }
    
    drawSnake();
    drawFood();
}

function drawSnake(){
    snake.forEach(coordinate => {
       if(blocks[`${coordinate.x},${coordinate.y}`]) {
           blocks[`${coordinate.x},${coordinate.y}`].classList.add('fill');
       }
    });
}

function drawFood(){
    if(blocks[`${food.x},${food.y}`]) {
       blocks[`${food.x},${food.y}`].classList.add('food');
    }
}

function clearBlock(x, y) {
    if(blocks[`${x},${y}`]) {
       blocks[`${x},${y}`].classList.remove('fill');
       blocks[`${x},${y}`].classList.remove('food');
    }
}

function updateTimer() {
    gameTime++;
    let minutes = Math.floor(gameTime / 60);
    let seconds = gameTime % 60;
    document.getElementById('timer').textContent = 
       String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function startTimer() {
    gameTime = 0;
    timerIntervalId = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerIntervalId);
}

function adjustGridSize(delta) {
    if(gameRunning) return;
    
    let newSize = col + delta;
    if(newSize >= minGridSize && newSize <= maxGridSize) {
       col = newSize;
       row = newSize;
       document.getElementById('grid').textContent = row + 'x' + col;
       snake = [{x: Math.floor(row/2), y: Math.floor(col/2)}];
       food = {x: Math.floor(Math.random()*col), y: Math.floor(Math.random()*row)};
       createBoard();
    }
    
    // Disable buttons at limits
    document.getElementById('gridMinusBtn').disabled = col <= minGridSize;
    document.getElementById('gridPlusBtn').disabled = col >= maxGridSize;
}

function updateSpeed() {
    speed = document.getElementById('speedSlider').value;
    document.getElementById('speedDisplay').textContent = speed + 'ms';
    
    if(gameRunning) {
       clearInterval(intervalId);
       intervalId = setInterval(gameLoop, speed);
    }
}

function startGame() {
    if(gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('gridMinusBtn').disabled = true;
    document.getElementById('gridPlusBtn').disabled = true;
    document.getElementById('speedSlider').disabled = true;
    
    startTimer();
    
    if(intervalId) clearInterval(intervalId);
    intervalId = setInterval(gameLoop, speed);
}

function stopGame() {
    gameRunning = false;
    gamePaused = true;
    clearInterval(intervalId);
    stopTimer();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('gridMinusBtn').disabled = false;
    document.getElementById('gridPlusBtn').disabled = false;
    document.getElementById('speedSlider').disabled = false;
}

function restartGame(){
    stopGame();
    stopTimer();
    document.getElementById('gameOverModal').classList.remove('active');
    
    score = 0;
    gameTime = 0;
    snake = [{x: Math.floor(row/2), y: Math.floor(col/2)}];
    direction = 'left';
    nextDirection = 'left';
    food = {x: Math.floor(Math.random()*col), y: Math.floor(Math.random()*row)};
    
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = '00:00';
    
    createBoard();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('gridMinusBtn').disabled = false;
    document.getElementById('gridPlusBtn').disabled = false;
    document.getElementById('speedSlider').disabled = false;
}

function gameLoop(){
    if(!gameRunning) return;
    
    direction = nextDirection;
    let head = null;

    if(direction === "left"){
       head = {x:snake[0].x, y:snake[0].y-1}
    }
    else if(direction === "right"){
       head = {x:snake[0].x, y:snake[0].y+1}
    }
    else if(direction === "up"){
       head = {x:snake[0].x-1, y:snake[0].y}
    }
    else if(direction === "down"){
       head = {x:snake[0].x+1, y:snake[0].y}
    }

    // Wall collision
    if(head.x < 0 || head.x >= row || head.y < 0 || head.y >= col){
       endGame();
       return;
    }

    // Self collision
    for(let segment of snake) {
       if(head.x === segment.x && head.y === segment.y) {
           endGame();
           return;
       }
    }

    // Food collision
    if(head.x === food.x && head.y === food.y){
       snake.unshift(food);
       score++;
        
       // Expand grid
       col += 2;
       row += 2;
        
       // Regenerate food in new space
       food = {x: Math.floor(Math.random()*col), y: Math.floor(Math.random()*row)};
        
       // Recreate board with new size
       createBoard();
        
       // Update grid display
       document.getElementById('score').textContent = score;
       document.getElementById('grid').textContent = row + 'x' + col;
        
       return;
    }

    // Remove tail
    let tail = snake.pop();
    clearBlock(tail.x, tail.y);
    
    // Add new head
    snake.unshift(head);
    clearBlock(head.x, head.y);
    drawSnake();
}

function endGame() {
    gameRunning = false;
    stopTimer();
    clearInterval(intervalId);
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('gridMinusBtn').disabled = false;
    document.getElementById('gridPlusBtn').disabled = false;
    document.getElementById('speedSlider').disabled = false;
    
    // Update best score
    if(score > bestScore) {
       bestScore = score;
       localStorage.setItem('snakeBestScore', bestScore);
       document.getElementById('bestScore').textContent = bestScore;
    }
    
    let minutes = Math.floor(gameTime / 60);
    let seconds = gameTime % 60;
    let timeString = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalGrid').textContent = row + 'x' + col;
    document.getElementById('finalTime').textContent = timeString;
    document.getElementById('gameOverModal').classList.add('active');
}

// Initialize board
createBoard();

// Event listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('restartModalBtn').addEventListener('click', restartGame);
document.getElementById('gridMinusBtn').addEventListener('click', () => adjustGridSize(-2));
document.getElementById('gridPlusBtn').addEventListener('click', () => adjustGridSize(2));
document.getElementById('speedSlider').addEventListener('input', updateSpeed);

// Disable grid plus button if already at max
if(col >= maxGridSize) {
    document.getElementById('gridPlusBtn').disabled = true;
}

addEventListener("keydown", (e) => {
    if(!gameRunning) return;
    
    if(e.key === "ArrowUp" && direction !== "down"){
       nextDirection = "up";
    }
    else if(e.key === "ArrowDown" && direction !== "up"){
       nextDirection = "down";
    }
    else if(e.key === "ArrowLeft" && direction !== "right"){
       nextDirection = "left";
    }
    else if(e.key === "ArrowRight" && direction !== "left"){
       nextDirection = "right";
    }
});







