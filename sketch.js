function setup() {
  createCanvas(601, 601);
  frameRate(60);
  for (let i = 0; i < 4; i++) {
    vectorDir.push(createVector(dx[i], dy[i]));
  }
  for (let i = 1; i <= 2; i++) {
    player.push(new Shooter(i));
  }
  newGame();
}

function draw() {
  background(220);
  for(let i = 1; i <= 2; i++){
    if(player[i].hp <= 0){
      push();
      fill(random(255), random(255), random(255));
      if(player[2].hp <= 0) text("Player 1 wins!", centerX - 40, centerY - 10);
      else text("Player 2 wins!", centerX - 40, centerY - 10);
      pop();
      text("Press Enter to play again.", centerX - 70, centerY + 10)
      GameStatus = "ended";
      return;
    }
  }
  for (let i = 1; i <= 2; i++){
    player[i].move();
    player[i].directGun();
    player[i].shoot();
  } 
  ellipse(centerX, centerY, Radius * 2, Radius * 2);
  for (let i = 1; i <= 2; i++) {
    player[i].outerDisplay();
    player[i].display();
  }
  if(GameStatus == "ready"){
    let t = millis() - timeStart;
    push();
    textSize(30);
    if(t < 3000){
      let tx = 4 + floor(-t / 1000);  
      text(tx.toString(), centerX - 10, centerY + 10);
    } 
    else if(t < 4000) text("Shoot!", centerX - 45, centerY + 10);
    else GameStatus = "playing";
    pop();
  }
  for(let i = 0; i < bullet.length; i++){
    bullet[i].fly();
    push();
    fill('red');
    bullet[i].display();
    pop();
  }
  bullet = bullet.filter(x => (x.exist));
}

function keyPressed(){
  if(keyCode == 13 && GameStatus == "ended") newGame();
}

function keyReleased(){
  if(keyCode == 81) player[1].auto = !player[1].auto;
  else if(keyCode == 8) player[2].auto = !player[2].auto;
  return false;
}

function newGame(){
  player[1].spawn(150, 150);
  player[2].spawn(450, 450);
  bullet = [];
  GameStatus = "ready";
  timeStart = millis();
  
}

function hitBorder(s) {
  return dist(centerX, centerY, s.x, s.y) + s.radius >= Radius;
}

function hit(c1, c2) {
  return dist(c1.x, c1.y, c2.x, c2.y) <= c1.radius + c2.radius;
}

function fixBorder(s){
  let out = createVector(s.x - centerX, s.y - centerY);
  let fixed = createVector(s.x - centerX, s.y - centerY);
  fixed.normalize();
  fixed.mult(Radius - s.radius);
  out.sub(fixed);
  s.x -= out.x;
  s.y -= out.y;
}
