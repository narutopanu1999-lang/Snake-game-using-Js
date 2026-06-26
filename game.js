const board = document.querySelector('.board');
const col = 10;
const row = 10;


board.style.setProperty('--grid-col',col);
board.style.setProperty('--grid-row',row); 

let intervalId = null;

let food = {x:Math.floor(Math.random()*col),y:Math.floor(Math.random()*row)}
const blocks = []

const snake = [{x:1,y:6}];

for(let i = 0;i<row;i++){
    for(let j = 0;j<col;j++){
    const block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
    blocks[`${i},${j}`] = block;
    }
    
}


let direction = 'left';

function drawSnake(){
    snake.forEach(coordinate =>{
       blocks[ `${coordinate.x},${coordinate.y}`].classList.add('fill')
       
    })

     

}


    intervalId = setInterval(()=>{

     let head = null;

    
     if(direction === "left"){
        head = {x:snake[0].x,y:snake[0].y-1}
     }
     else if(direction === "right"){
        head = {x:snake[0].x,y:snake[0].y+1}
     }
     else if(direction === "up"){
        head = {x:snake[0].x-1,y:snake[0].y}
     }
     else if(direction === "down"){
        head = {x:snake[0].x+1,y:snake[0].y}
     }


     if(head.x<0 || head.x>=row || head.y<0 || head.y>=col){
        alert("Game Over");
        clearInterval(intervalId);
     }


    if(head.x === food.x && head.y === food.y){
        snake.unshift(food);
    }

    snake.forEach(coordinate =>{
       blocks[`${coordinate.x},${coordinate.y}`].classList.remove('fill')
    })
      
    snake.unshift(head);
    snake.pop();
    drawSnake();

},300);




addEventListener("keydown",(e) =>{
    if(e.key === "ArrowUp"){
        direction = "up";
    }
    else if(e.key === "ArrowDown"){
        direction = "down";
    }
    else if(e.key === "ArrowLeft"){
        direction = "left";
    }
    else if(e.key === "ArrowRight"){
        direction = "right";
    }
    
})







