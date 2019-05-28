function setup() {
  createCanvas(401, 401);
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
  if(player[1].hp <= 0){
    text("Player 2 wins", 190, 190);
    return;
  }
  else if(player[2].hp <= 0){
    text("Player 1 wins", 190, 190);
    return;
  }
  for (let i = 1; i <= 2; i++){
    player[i].move();
    player[i].shoot();
  } 
  ellipse(centerX, centerY, Radius * 2, Radius * 2);
  for (let i = 1; i <= 2; i++) {
    player[i].display();
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
  if(key == 13) newGame;
}
function newGame(){
  player[1].spawn(100, 100);
  player[2].spawn(300, 300);
  bullet = [];
}

function hitBorder(s) {
  return dist(centerX, centerY, s.x, s.y) + s.radius >= Radius;
}

function collide(c1, c2) {
  return dist(c1.x, c1.y, c2.x, c2.y) <= c1.radius + c2.radius;
}
