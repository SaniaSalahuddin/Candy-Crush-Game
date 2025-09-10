///variables
var candies=["Blue","Orange","Green","Red","Purple","Yellow"];
var special=["Blue-Striped-Horizontal","Blue-Striped-Vertical",
    "Red-Striped-Horizontal","Red-Striped-Vertical",
    "Orange-Striped-Horizontal","Orange-Striped-Vertical",
    "Green-Striped-Horizontal","Green-Striped-Vertical",
    "Purple-Striped-Horizontal","Purple-Striped-Vertical",
    "Yellow-Striped-Horizontal","Yellow-Striped-Vertical"
]
var board=[];
var rows=9;
var columns=9;
var score=0;
var bgMusic = new Audio("./audio/music.mp3");
bgMusic.loop = true;
["click", "keydown", "touchstart"].forEach(event => {
    document.addEventListener(event, () => {
        bgMusic.play().catch((e) => {
            console.log("Autoplay blocked:", e);
        });
    }, { once: true });
});

var gameOverSound = new Audio("./audio/game-over.mp3");
var turns=20;
var moveMade = false;

var currTile;
var otherTile;
function randomFour()
{
      return special[Math.floor(Math.random()*special.length)];
}


// Wait for first user click to play music
// document.addEventListener("click", function () {
//     bgMusic.play();
// }, { once: true });
window.onload=function(){
    
  startGame();
   bgMusic.play(); 
   
  
    
   
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
        checkTurn();
    },100)
}
function randomCandy()
{
    return candies[Math.floor(Math.random()*candies.length)];
}
    function startGame()
    {
        
        for(let r=0;r<rows;r++)
        {
            let row=[];
            for(let c=0;c<columns;c++)
            {
let tile=document.createElement("img");
tile.id=r.toString()+"-"+c.toString();
tile.src="./image/"+randomCandy()+".png";

tile.addEventListener("dragstart",dragStart);
tile.addEventListener("dragover",dragOver);
tile.addEventListener("dragenter",dragEnter);
tile.addEventListener("dragleave",dragLeave);
tile.addEventListener("drop",dragDrop);
tile.addEventListener("dragend",dragEnd);
           
document.getElementById("board").append(tile);
row.push(tile);


            }
            board.push(row);
        }
        console.log(board);
    }
    function dragStart(){
        currTile=this;
    }
    function dragOver(e)
    {
e.preventDefault();
    }
    function dragEnter(e)
    {
        e.preventDefault();
    }
    function dragLeave()
    {

    }
    function dragDrop()
    {
        otherTile=this;
    }
    function dragEnd()
    {
        if(currTile.src.includes("blank") || otherTile.src.includes("blank"))
        {
            return;
        }
        let currCoords=currTile.id.split("-");
        let r=parseInt(currCoords[0]);
        let c=parseInt(currCoords[1]);
        let otherCoords=otherTile.id.split("-");
        let r2=parseInt(otherCoords[0]);
        let c2=parseInt(otherCoords[1]);

        //Moves
        let moveLeft=c2==c-1 && r==r2;
        let moveRight=c2==c+1 && r==r2;
        let moveUp=r2==r-1 && c==c2;
        let moveDown=r2==r+1 && c==c2;
        let isAdjacent=moveLeft || moveDown|| moveRight|| moveUp;
        if(isAdjacent && !checkTurn())
        {
let currImg=currTile.src;
let otherImg=otherTile.src;
otherTile.src=currImg;
currTile.src=otherImg;


let validMove=checkValid3() || checkValid4()  ;
console.log(validMove)
console.log(checkTurn())
 
        if (validMove) {
            moveMade = true;  // ✅ Only when it's a good match
        } else {
           let currImg=currTile.src;
let otherImg=otherTile.src;
otherTile.src=otherImg;
currTile.src=currImg; 
turns -= 1;

        }


        }
    }
    
       
    


 function check() {
    let matchFound = false;
    matchFound = crushyFour() || matchFound;
    matchFound = crushyThree() || matchFound;
    // console.log("Match:", matchFound, " | MoveMade:", moveMade, " | Turns:", turns);


    if (matchFound && moveMade) {
        turns -= 1;
        moveMade = false; // ✅ Reset flag after using the turn
    }
}

    function crushCandy()
    {
        check();
        
        //crushyFive
        crushyFour();
        crushyThree();
        document.getElementById('score').innerText=score;
        document.getElementById('turns').innerText=turns;

    }
    function crushyFour()
    {
        let found = false;
        //check rows
        for(let r=0;r<rows;r++)
        {
            for(let c=0;c<columns-3;c++)
            {
                let candy1=board[r][c];
                let candy2=board[r][c+1];
                let candy3=board[r][c+2];
                let candy4=board[r][c+3];
                if(candy1.src===candy2.src && candy2.src===candy3.src  && candy3.src===candy4.src && !candy1.src.includes("blank"))
                {
                    candy1.src="./image/blank.png";
                    candy2.src="./image/blank.png";
                    candy3.src="./image/blank.png";
                    candy4.src="./image/blank.png";
score+=40;
// turns-=1;
found=true;
                }
             
            }
        }
         for(let c=0;c<columns;c++)
    {
        for(let r=0;r<rows-3;r++)
        {
            let candy1=board[r][c];
            let candy2=board[r+1][c];
            let candy3=board[r+2][c];
            let candy4=board[r+3][c]
              
            if(candy1.src===candy2.src && candy2.src===candy3.src && candy3.src===candy4.src && !candy1.src.includes("blank"))
            {
                candy1.src="./image/blank.png";
                candy2.src="./image/blank.png";
                candy3.src="./image/blank.png";
                candy4.src="./image/blank.png";
score+=40;
// turns-=1;
found=true;
            }
    
        }
    }
    return found;
  

}
    function clearRow(rowIndex) {
    for (let c = 0; c < columns; c++) {
        if (!board[rowIndex][c].src.includes("blank")) {
            board[rowIndex][c].src = "./image/blank.png";
            score += 10;
        }
    }
}

function clearColumn(colIndex) {
    for (let r = 0; r < rows; r++) {
        if (!board[r][colIndex].src.includes("blank")) {
            board[r][colIndex].src = "./image/blank.png";
            score += 10;
        }
    }
}
function getCandyType(src) {
    if (src.includes("Striped-Horizontal")) return "striped-horizontal";
    if (src.includes("Striped-Vertical")) return "striped-vertical";
    // Add "wrapped" or others later if needed
    return "normal";
}

function crushyThree()
{
    //check rows
    let found = false;
    for(let r=0;r<rows;r++)
    {
        for(let c=0;c<columns-2;c++)
        {
            let candy1=board[r][c];
            let candy2=board[r][c+1];
            let candy3=board[r][c+2];
          if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
    
    candy1.src = "./image/blank.png";
    candy2.src = "./image/blank.png";
    candy3.src = "./image/blank.png";
    score += 30;
    // turns -= 1;
    found=true;
}
else{
    
let data1 = candy1.src.split('/').pop().split('.')[0];



//    console.log(data1)
   let exact1=data1.split("-")[0];
   

   let data2=candy2.src.split('/').pop().split('.')[0];
   let exact2=data2.split("-")[0];
   
   let data3=candy3.src.split('/').pop().split('.')[0];
   let exact3=data3.split("-")[0];
   
   if(exact1===exact2 && exact2===exact3 && !exact1.includes("blank"))
   {
    //  let type1 = getCandyType(candy1.src);
    // let type2 = getCandyType(candy2.src);
    // let type3 = getCandyType(candy3.src);

    if (data1.includes("Striped-Horizontal")) clearRow(r);
    else if (data1.includes("Striped-Vertical")) clearColumn(c);

    if (data2.includes("Striped-Horizontal")) clearRow(r);
    else if (data2.includes("Striped-Vertical")) clearColumn(c+1);

    if (data3.includes("Striped-Horizontal")) clearRow(r);
    else if (data3.includes("Striped-Vertical")) clearColumn(c+2);

    candy1.src = "./image/blank.png";
    candy2.src = "./image/blank.png";
    candy3.src = "./image/blank.png";
    score += 30;
    // turns-=1;
 found=true;
   }
}


        }
    }
    //check columns
    for(let c=0;c<columns;c++)
    {
        for(let r=0;r<rows-2;r++)
        {
            let candy1=board[r][c];
            let candy2=board[r+1][c];
            let candy3=board[r+2][c];

         if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
    

    candy1.src = "./image/blank.png";
    candy2.src = "./image/blank.png";
    candy3.src = "./image/blank.png";
    score += 30;
    // turns -= 1;
    found=true;
}
else{
    
let data1 = candy1.src.split('/').pop().split('.')[0];



//    console.log(data1)
   let exact1=data1.split("-")[0];
   

   let data2=candy2.src.split('/').pop().split('.')[0];
   let exact2=data2.split("-")[0];
   
   let data3=candy3.src.split('/').pop().split('.')[0];
   let exact3=data3.split("-")[0];
   
   if(exact1===exact2 && exact2===exact3 && !exact1.includes("blank"))
   {
    //  let type1 = getCandyType(candy1.src);
    // let type2 = getCandyType(candy2.src);
    // let type3 = getCandyType(candy3.src);

    if (data1.includes("Striped-Horizontal")) clearRow(r);
    else if (data1.includes("Striped-Vertical")) clearColumn(c);

    if (data2.includes("Striped-Horizontal")) clearRow(r+1);
    else if (data2.includes("Striped-Vertical")) clearColumn(c);

    if (data3.includes("Striped-Horizontal")) clearRow(r+2);
    else if (data3.includes("Striped-Vertical")) clearColumn(c);

    candy1.src = "./image/blank.png";
    candy2.src = "./image/blank.png";
    candy3.src = "./image/blank.png";
    score += 30;
    // turns -= 1;
    found=true;
   }
}

        }
    }
    return found;
}
function checkValid3()
{
   //check rows
    for(let r=0;r<rows;r++)
    {
        for(let c=0;c<columns-2;c++)
        {
            let candy1=board[r][c];
            let candy2=board[r][c+1];
            let candy3=board[r][c+2];
            if(candy1.src===candy2.src && candy2.src===candy3.src && !candy1.src.includes("blank"))
            {
               return true
            }

        }
    }
    //check columns
    for(let c=0;c<columns;c++)
    {
        for(let r=0;r<rows-2;r++)
        {
            let candy1=board[r][c];
            let candy2=board[r+1][c];
            let candy3=board[r+2][c];

            if(candy1.src===candy2.src && candy2.src===candy3.src && !candy1.src.includes("blank"))
            {
               return true

            }
        }
    } 
    return false;
}
function checkValid4()
{
   //check rows
    for(let r=0;r<rows;r++)
    {
        for(let c=0;c<columns-3;c++)
        {
            let candy1=board[r][c];
            let candy2=board[r][c+1];
            let candy3=board[r][c+2];
            let candy4=board[r][c+3]
            if(candy1.src===candy2.src && candy2.src===candy3.src && candy3.src===candy4.src && !candy1.src.includes("blank"))
            {
               return true
            }

        }
    }
    //check columns
    for(let c=0;c<columns;c++)
    {
        for(let r=0;r<rows-3;r++)
        {
            let candy1=board[r][c];
            let candy2=board[r+1][c];
            let candy3=board[r+2][c];
            let candy4=board[r+3][c];

            if(candy1.src===candy2.src && candy2.src===candy3.src && candy3.src===candy4.src && !candy1.src.includes("blank"))
            {
               return true

            }
        }
    } 
    return false;
}


// function checkValid5()
// {
//    //check rows
//     for(let r=0;r<rows;r++)
//     {
//         for(let c=0;c<columns-2;c++)
//         {
//             let candy1=board[r][c];
//             let candy2=board[r][c+1];
//             let candy3=board[r][c+2];
//             if(candy1.src===candy2.src && candy2.src===candy3.src && !candy1.src.includes("blank"))
//             {
//                return true
//             }

//         }
//     }
//     //check columns
//     for(let c=0;c<columns;c++)
//     {
//         for(let r=0;r<rows-2;r++)
//         {
//             let candy1=board[r][c];
//             let candy2=board[r+1][c];
//             let candy3=board[r+2][c];

//             if(candy1.src===candy2.src && candy2.src===candy3.src && !candy1.src.includes("blank"))
//             {
//                return true

//             }
//         }
//     } 
//     return false;
// }
function slideCandy()
{
    for(let c=0;c<columns;c++)
    {
        let ind=rows-1;
        for(let r=rows-1;r>=0;r--)
        {
            if(!board[r][c].src.includes("blank"))
            {
                board[ind][c].src=board[r][c].src;
                ind-=1;
            }
        }
        for(let r=ind;r>=0;r--)
        {
            board[r][c].src="./image/blank.png";
        }
    }
}
function generateCandy() {
    const foundMatch4 = checkValid4(); // Call once

    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            if (foundMatch4) {
                board[0][c].src = "./image/" + randomFour() + ".png"; 
            } else {
                board[0][c].src = "./image/" + randomCandy() + ".png"; 
            }
        }
    }
}


var gameOverPlayed = false;

function checkTurn() {
    if (turns == 0) {
        if (!gameOverPlayed) {
            let txt = "Game Over!";
            document.querySelector(".head").innerText = txt;

            bgMusic.pause();
            gameOverSound.play();

            gameOverPlayed = true; // ✅ Prevent playing again
        }
        return true;
    } else {
        return false;
    }
}
