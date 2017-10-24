function _(is_top,target){
  return (is_top)?parseInt(target.style.top.replace("%","")):parseInt(target.style.left.replace("%",""));
}
function apply(is_top,target,val){
  if(is_top)
     target.style.top = val+"%";
  else
     target.style.left = val+"%";
}
class Car{
  constructor(){
    document.getElementById('messageBox').attributes[1].value = "false";
    this.roads = document.getElementsByClassName('centerLine');
    this.opponentCar = document.getElementsByClassName('opponentCar');
    this.playerCar = document.getElementById('playerCar');
       this.playerCar.style.top = "80%";
       this.playerCar.style.left = "40%";
    this.roadSpeed = 2;
    this.opponentCarSpeed = 1;
    this.playerCarSpeed = 1;
        for(let i=0;i<this.opponentCar.length;i++)
           this.opponentCarReset(this.opponentCar[i],i);
    this.gameOver = false;
    this.scoreBoard = document.getElementById('currentScore');
    document.getElementById('highScore').innerText = "Best "+document.cookie;
    this.score = 0;
  }
  opponentCarReset(target,i){
    let base = -5;
      let top = -Math.floor((Math.random()*30+20));
      let left = Math.floor((Math.random()*30+(base+(i*30))));
      apply(true,target,top);
      apply(false,target,left);
  }
  roadUpdate(){
    for(let i=0;i<this.roads.length;i++){
       let top = _(true,this.roads[i]);
       if(top>100)
          top = -25;
       apply(true,this.roads[i],top+this.roadSpeed);
    }
  }
  opponentCarUpdate(){
    for(let i=0;i<this.opponentCar.length;i++){
      let top = _(true,this.opponentCar[i]);
      if(top>105)
         this.opponentCarReset(this.opponentCar[i],i);
      else
         apply(true,this.opponentCar[i],top+this.opponentCarSpeed);
    }
    this.scoreBoard.innerText = "Score "+this.score++;
  }
  playerUpdate(x,y){
      if(this.gameOver)
         return;
     let top = _(true,this.playerCar)+(y*this.playerCarSpeed);
     let left = _(false,this.playerCar)+(x*this.playerCarSpeed);
       if(left>=-5&&left<=85&&top>=5&&top<=95){
         apply(true,this.playerCar,top);
         apply(false,this.playerCar,left);
       }
        if(x==-1)
           this.playerCar.style.transform = "rotateZ(85deg)"
        else if(x==1)
           this.playerCar.style.transform = "rotateZ(95deg)"
  }
  is_damaged(){
    let pla_top = this.playerCar.getBoundingClientRect().top;
    let pla_left = this.playerCar.getBoundingClientRect().left;
    let pla_bottom = this.playerCar.getBoundingClientRect().bottom;
    let pla_right = this.playerCar.getBoundingClientRect().right;

    for(let i=0;i<this.opponentCar.length;i++){
      let opp_top = this.opponentCar[i].getBoundingClientRect().top;
      let opp_left = this.opponentCar[i].getBoundingClientRect().left;
      let opp_bottom = this.opponentCar[i].getBoundingClientRect().bottom;
      let opp_right = this.opponentCar[i].getBoundingClientRect().right;
         if((pla_top<opp_bottom&&pla_bottom>opp_top)&&(pla_left<opp_right&&pla_right>opp_left))
            return true;
    }
    return false;
  }
}
let car;
window.onkeydown = function(e){
  switch(e.which){
    case 37:car.playerUpdate(-1,0);break;
    case 38:car.playerUpdate(0,-1);break;
    case 39:car.playerUpdate(1,0);break;
    case 40:car.playerUpdate(0,1);break;
    case 32:start();break;
  }
}
function start(){
   if(car!=undefined&&!car.gameOver)
       return;
   car = new Car();
   let interval = setInterval(function () {
     if(car.is_damaged()){
       clearInterval(interval);
       document.getElementById('messageBox').attributes[1].value = "true";
       car.gameOver = true;
         if(document.cookie == null || document.cookie == "")
           document.cookie = car.score;
         else{
           document.cookie = (parseInt(document.cookie)>car.score)?parseInt(document.cookie):car.score;
        }
     }
     car.roadUpdate();
     car.opponentCarUpdate();
   },10);
}
window.onkeyup = function(e){
  switch(e.which){
    case 37:car.playerCar.style.transform = "rotateZ(90deg)";break;
    case 39:car.playerCar.style.transform = "rotateZ(90deg)";break;
  }
}
let btnInterval;

function run(x,y){
  if(car==undefined||car.gameOver)
    return;
  btnInterval = setInterval(function () {
    car.playerUpdate(x,y);
  }, 10);
}

function stop(){
  if(car==undefined)
    return;
  car.playerCar.style.transform = "rotateZ(90deg)";
  clearInterval(btnInterval);
}
