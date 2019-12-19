const playArea = {};
const player = {};

playArea.stats = document.querySelector(".stats");
playArea.main = document.querySelector(".main");
playArea.game = document.querySelector(".game");
playArea.btns = document.querySelectorAll(".btn");
playArea.page = document.querySelectorAll(".page");
console.log(playArea);
document.addEventListener("DOMContentLoaded",getData);

let cnt =0;

playArea.btns.forEach(function(item){
    console.log(item);
    item.addEventListener("click",handleBtn);
})

function getData(){
    playArea.main.classList.add("visible");
    fetch("https://api.myjson.com/bins/gungm").then(function(rep){
        return rep.json();

    }).then(function(data){
     gameObj = data.data;
     console.log(gameObj);
     buildBord();
    })
    console.log("DOM loaded");
}

function updateScore(){
    playArea.score.innerHTML
}

  function updateScore(){
      playArea.score.innerHTML = "Score:"+player.score+"Lives: "+player.items;
  }

function buildBord(){
    playArea.score = document.createElement("span");
    playArea.score.innerHTML = "Press Button to Start";
  
    playArea.stats.appendChild(playArea.score);
    let rows = 4;
    let cols = 4;
   

    playArea.game.style.width = cols *100 + (cols*2);
    playArea.game.style.margin = "auto";
    for(let y=0;y<cols;y++){
        let divMain = document.createElement("div");
        divMain.setAttribute("class","row");
        divMain.style.width = cols*100 + (cols*2);
        for(let x=0;x<rows;x++){
            let div =document.createElement("div");
            div.setAttribute("class","pop");
            cnt++;
            div.innerHTML = cnt;
            div.cnt = cnt;
            divMain.appendChild(div);
        }
        playArea.game.appendChild(divMain);
    }
}

function handleBtn(e){
    console.log(e.target.classList.contains("newGame"));
    if(e.target.classList.contains("newGame")){
        console.log("Yes");
        startGame();
    }
}

function startGame(){
    player.score =0;
    player.items = 3;
    playArea.main.classList.remove("visible");
    playArea.game.classList.add("visible");
    player.gameOver =false;
    startPop();
    updateScore();
}

function randomUp(){
    const pops = document.querySelectorAll(".pop");
    const idx =Math.floor(Math.random()*pops.length);
    
    if(pops[idx].cnt == playArea.last){
        return randomUp();
    }
    playArea.last = pops[idx].cnt;
    return pops[idx];
}

function startPop(){
    let newPop = randomUp();
    console.log(newPop);
    newPop.classList.add("active");
    newPop.addEventListener("click",hitPop);
    const time = Math.round(Math.random()*(1500) + 750);
    const val = Math.floor(Math.random() * gameObj.length);
    newPop.old =newPop.innerText;
    newPop.v = gameObj[val].value;
    newPop.innerHTML = gameObj[val].icon+"<br>"+gameObj[val].value;
    playArea.inPlay = setTimeout(function(){
        newPop.classList.remove("active");
        newPop.removeEventListener("click",hitPop);
        newPop.innerText = newPop.old;
        if(newPop.v > 0){
            player.items--;
            updateScore();
        }
        if(player.items <= 0){
            gameOver();
        }
        if(!player.gameOver){
            startPop();
        }
    },time)

}

function gameOver(){
    player.gameOver = true;
    playArea.main.classList.add("visible");
    playArea.game.classList.remove("visible");
    document.querySelector(".newGame").innerHTML = "Try Again";
}

function hitPop(e){
console.log(e.target.v);
let newPop = e.target;
player.score = player.score + e.target.v;
updateScore();
newPop.classList.remove("active");
newPop.removeEventListener("click",hitPop);
newPop.innerText = newPop.old;
clearTimeout(playArea.inPlay);
if(!player.gameOver){
    startPop();
}
}
