# 🐍 Snake Game - A Learning Journey

Hi! I'm documenting how I built an interactive **Snake Game** using HTML, CSS, and JavaScript. This is a complete guide showing what I learned and how I implemented each feature step by step.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features Implemented](#features-implemented)
3. [Technology Stack](#technology-stack)
4. [Implementation Details](#implementation-details)
5. [File Structure](#file-structure)
6. [How It Works](#how-it-works)
7. [Key Learnings](#key-learnings)

---

## 🎮 Project Overview

This is a fully functional **Snake Game** where players control a snake, eat food to grow, and the grid expands as they progress. The game includes adjustable difficulty settings, speed controls, and score tracking.

### Game Features:
- ✅ Interactive snake movement with arrow keys
- ✅ Grid size adjustment (10×10 to 50×50)
- ✅ Speed control slider (50ms to 300ms)
- ✅ Real-time timer
- ✅ Best score tracking (saved in browser)
- ✅ Game over detection
- ✅ Growing grid as snake eats food
- ✅ Pause/Resume functionality

---

## 🚀 Features Implemented

### 1. **Game Board & Grid System**
The game board is created dynamically using CSS Grid. When the page loads, JavaScript creates a 20×20 grid of small squares.

**How I did it:**
```javascript
// Set grid dimensions
let col = 20;
let row = 20;

// Create HTML elements for each square
for(let i = 0; i < row; i++){
    for(let j = 0; j < col; j++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${i},${j}`] = block;  // Store reference
    }
}
```

**CSS Grid Setup:**
```css
.board{
    display:grid;
    grid-template-columns: repeat(var(--grid-col),1fr);
    grid-template-rows: repeat(var(--grid-row),1fr);
}
```

**What I Learned:** Using CSS variables (`--grid-col`, `--grid-row`) makes it easy to change grid size dynamically!

---

### 2. **Snake Movement & Controls**

The snake is represented as an array of coordinates. When the player presses an arrow key, a new head is added and the tail is removed, creating movement.

**Data Structure:**
```javascript
let snake = [{x:10, y:10}];  // Array of body segments
let direction = 'left';       // Current direction
```

**Movement Logic:**
```javascript
function gameLoop(){
    // Calculate new head position based on direction
    if(direction === "left"){
        head = {x:snake[0].x, y:snake[0].y-1}
    }
    // ... other directions ...
    
    // Add new head
    snake.unshift(head);
    
    // Remove tail (creates movement effect)
    snake.pop();
}
```

**Keyboard Controls:**
```javascript
addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp"){
        direction = "up";
    }
    // ... other directions ...
});
```

**What I Learned:** Using `unshift()` and `pop()` on arrays creates smooth animations without redrawing everything!

---

### 3. **Food System**

Food appears as a red square on the board. When the snake eats it:
- Score increases
- Grid expands by 2 cells
- New food spawns in the new space
- Snake grows by 1 segment

**Food Spawn Logic:**
```javascript
let food = {
    x: Math.floor(Math.random()*col), 
    y: Math.floor(Math.random()*row)
};

// Check if snake ate food
if(head.x === food.x && head.y === food.y){
    snake.unshift(food);  // Add food to snake (grow)
    score++;
    
    // Expand grid
    col += 2;
    row += 2;
    
    // Spawn new food in expanded area
    food = {
        x: Math.floor(Math.random()*col), 
        y: Math.floor(Math.random()*row)
    };
}
```

**What I Learned:** Using objects `{x, y}` is cleaner than storing coordinates separately!

---

### 4. **Grid Adjustment Buttons**

Players can adjust the starting grid size using + and - buttons (10×10 to 50×50). These buttons are positioned on the LEFT side of the game board.

**HTML Structure:**
```html
<button class="side-btn" id="gridMinusBtn">−</button>
<span id="grid" class="control-value">20x20</span>
<button class="side-btn" id="gridPlusBtn">+</button>
```

**Adjustment Function:**
```javascript
function adjustGridSize(delta) {
    if(gameRunning) return;  // Disable during gameplay
    
    let newSize = col + delta;
    if(newSize >= 10 && newSize <= 50) {
        col = newSize;
        row = newSize;
        createBoard();  // Recreate with new size
    }
}
```

**Event Listeners:**
```javascript
document.getElementById('gridMinusBtn')
    .addEventListener('click', () => adjustGridSize(-2));
document.getElementById('gridPlusBtn')
    .addEventListener('click', () => adjustGridSize(2));
```

**What I Learned:** Validation (checking min/max) prevents bugs! Disabling controls during gameplay improves UX.

---

### 5. **Speed Control Slider**

A vertical slider on the RIGHT side lets players control snake speed from 50ms to 300ms.

**HTML:**
```html
<input type="range" id="speedSlider" 
       min="50" max="300" value="150" 
       class="vertical-slider">
<span id="speedDisplay">150ms</span>
```

**Speed Update Function:**
```javascript
function updateSpeed() {
    speed = document.getElementById('speedSlider').value;
    document.getElementById('speedDisplay').textContent = speed + 'ms';
    
    // Restart game loop with new speed
    if(gameRunning) {
        clearInterval(intervalId);
        intervalId = setInterval(gameLoop, speed);
    }
}
```

**Vertical Slider CSS:**
```css
.vertical-slider {
    width: 6px;
    height: 120px;
    writing-mode: bt-lr;  /* Makes it vertical */
}
```

**What I Learned:** CSS `writing-mode` property controls slider orientation! `clearInterval()` and `setInterval()` together restart the game loop.

---

### 6. **Timer Feature**

The timer tracks how long the current game has been running and displays in MM:SS format.

**Timer Implementation:**
```javascript
let gameTime = 0;

function updateTimer() {
    gameTime++;
    let minutes = Math.floor(gameTime / 60);
    let seconds = gameTime % 60;
    document.getElementById('timer').textContent = 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
}

function startTimer() {
    timerIntervalId = setInterval(updateTimer, 1000);  // Update every 1 second
}
```

**What I Learned:** `padStart(2, '0')` adds leading zeros! Two separate intervals (game loop + timer) run independently.

---

### 7. **Best Score Tracking**

Best scores are saved in the browser using `localStorage` so they persist even after closing the page.

**Saving Score:**
```javascript
if(score > bestScore) {
    bestScore = score;
    localStorage.setItem('snakeBestScore', bestScore);
    document.getElementById('bestScore').textContent = bestScore;
}
```

**Loading Score (on page load):**
```javascript
let bestScore = localStorage.getItem('snakeBestScore') || 0;
```

**What I Learned:** `localStorage` is perfect for simple data persistence! The `|| 0` handles first-time players.

---

### 8. **Collision Detection**

The game ends when the snake hits:
1. **Walls** - Going off the board edges
2. **Itself** - Running into its own body

**Collision Logic:**
```javascript
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
```

**What I Learned:** Early `return` statements prevent unnecessary code execution!

---

### 9. **Start, Stop, Restart Buttons**

Control buttons at the bottom manage game flow.

**HTML:**
```html
<button class="control-btn start-btn" id="startBtn">Start</button>
<button class="control-btn stop-btn" id="stopBtn" disabled>Stop</button>
<button class="control-btn restart-btn" id="restartBtn">Restart</button>
```

**Button States:**
```javascript
function startGame() {
    gameRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('gridMinusBtn').disabled = true;
    document.getElementById('gridPlusBtn').disabled = true;
    startTimer();
    intervalId = setInterval(gameLoop, speed);
}

function stopGame() {
    gameRunning = false;
    clearInterval(intervalId);
    stopTimer();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}
```

**What I Learned:** Disabling/enabling buttons creates a better user experience and prevents accidental inputs!

---

### 10. **Game Over Modal**

When the game ends, a modal popup shows final statistics.

**HTML:**
```html
<div class="game-over-modal" id="gameOverModal">
    <div class="game-over-content">
        <h1>GAME OVER!</h1>
        <p>Final Score: <span id="finalScore">0</span></p>
        <p>Grid Size: <span id="finalGrid">20x20</span></p>
        <p>Time: <span id="finalTime">00:00</span></p>
        <button class="restart-modal-btn" id="restartModalBtn">Play Again</button>
    </div>
</div>
```

**Modal CSS (Overlay):**
```css
.game-over-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);  /* Dark overlay */
    z-index: 999;
    justify-content: center;
    align-items: center;
}

.game-over-modal.active {
    display: flex;  /* Show when active */
}
```

**What I Learned:** Fixed positioning + high z-index keeps modal on top! `rgba()` with alpha creates transparency.

---

## 🛠️ Technology Stack

| Technology | Purpose | What I Used |
|-----------|---------|------------|
| **HTML** | Structure | Semantic elements, divs with IDs |
| **CSS** | Styling | CSS Grid, Flexbox, CSS Variables |
| **JavaScript** | Logic | ES6 features, DOM manipulation, events |
| **Browser APIs** | Storage | localStorage for best score |
| **CSS Grid** | Game Board | Dynamic grid creation |

---

## 📁 File Structure

```
Snake-Game/
│
├── index.html       # Main HTML page
├── style.css        # All styling (8,593 bytes)
├── game.js          # Game logic (8,692 bytes)
└── README.md        # Documentation
```

### File Sizes & Complexity:
- **HTML**: ~100 lines - Semantic structure with modals
- **CSS**: ~300 lines - Grid layout, buttons, responsive design
- **JavaScript**: ~350 lines - Game logic, event handlers, storage

---

## 🎮 How It Works - Step by Step

### **Game Initialization** (When page loads)
1. Create 20×20 grid of divs
2. Load best score from localStorage
3. Place snake at center
4. Spawn food at random location
5. Display 0 score, timer at 00:00
6. Wait for player to click "Start"

### **During Gameplay** (Every 150ms)
1. Calculate snake's head position based on direction
2. Check for wall collisions → End game if yes
3. Check for self collisions → End game if yes
4. Check for food collision → Grow snake if yes
5. Move snake (add head, remove tail)
6. Redraw board

### **When Game Ends**
1. Stop all intervals (game loop, timer)
2. Update best score if needed
3. Show game over modal
4. Allow player to play again

---

## 💡 Key Learnings

### 1. **DOM Manipulation**
I learned how to efficiently update the DOM without refreshing:
- Used `classList.add()` and `classList.remove()` for styling elements
- Stored element references in objects for fast access

### 2. **Game Loop Pattern**
The core of the game is an interval that repeats:
```javascript
intervalId = setInterval(gameLoop, speed);
```

### 3. **State Management**
Tracked multiple game states:
- `gameRunning` - Is game active?
- `gamePaused` - Is game paused?
- `snake` - Array of body segments
- `direction` - Current movement direction
- `score` - Current score
- `gameTime` - Elapsed seconds

### 4. **Event Handling**
Used different event types:
- `keydown` for snake direction
- `click` for buttons
- `input` for speed slider

### 5. **Performance Optimization**
- Used `blocks` object for O(1) element lookup instead of searching DOM
- Cleared intervals before creating new ones
- Disabled expensive operations during gameplay

### 6. **Data Persistence**
Used browser localStorage for simple data:
```javascript
localStorage.setItem('snakeBestScore', score);
let saved = localStorage.getItem('snakeBestScore');
```

### 7. **CSS Grid Magic**
CSS Grid made the game board super easy:
```css
display: grid;
grid-template-columns: repeat(var(--grid-col), 1fr);
```

---

## 🎯 What I Would Improve

If I continued this project, I would add:
- 🎵 Sound effects for eating food and game over
- 🎨 Themes/color schemes
- 🏅 Difficulty levels (obstacles, moving food)
- 📱 Mobile touch controls
- 🌐 Online leaderboard
- 🎬 Recording and replaying games
- 👻 Ghost/AI opponent

---

## 🤔 Challenges I Faced

1. **Infinite Grid**: First attempted infinite grid expansion, but limited to 50×50 for performance
2. **Slider Direction**: Getting vertical slider working took some CSS magic
3. **Timing Issues**: Timer and game loop intervals had to be managed separately
4. **LocalStorage Scope**: Learned that localStorage persists across tabs!

---

## 📖 Resources That Helped

- JavaScript documentation on arrays and objects
- CSS Grid guide
- localStorage API docs
- Understanding setInterval and clearInterval timing

---

## ✨ Credits

Built as a learning project to understand:
- Game development fundamentals
- JavaScript state management
- DOM manipulation
- CSS Grid and Flexbox
- Browser APIs

---

## 📝 How to Play

1. **Open** the game in a browser
2. **Adjust** grid size and speed before starting
3. **Click Start** to begin
4. **Use arrow keys** (↑ ↓ ← →) to move the snake
5. **Eat red blocks** to grow and score points
6. **Avoid walls** and your own body
7. **Click Stop** to pause
8. **Click Restart** to reset

---

**Last Updated:** September 24, 2026  
**Status:** ✅ Fully Functional  
**Difficulty:** Beginner-Friendly Code  
**Learning Level:** Great for learning game loops and DOM manipulation!
Step one: 
create a HTML file 
add 2 section 
section first will display information about time , score , highscore and restart and speed;

section 2 here the game is working 


step second :
 define how the section one and will look in css 


 step third :
 now add logic 
 -> make snake body 
 -> make food (pops up randomly in the grid)
 
