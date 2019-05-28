function setup() {
  createCanvas(901, 401);
  frameRate(60);
  for(let i = 0; i < 4; i++){
    vectorDir.push(createVector(dx[i], dy[i]));
  }
  for(let i = 1; i <= 2; i ++){
    Player.push(new Shooter(i));
  }
  Player[1].spawn(100, 100);
  Player[2].spawn(300, 300);
}

function draw() {
  background(220);
  for(let i = 1; i <= 2; i++)
    Player[i].move();
  DisplayGround();
  push();
  translate(500, 0);
  DisplayGround();
  pop();
}

function DisplayGround(){
  ellipse(centerX, centerY, Radius * 2, Radius * 2);
  for(let i = 1; i <= 2; i++){
    Player[i].dislay();
  }
}
function hitBorder(s){
  return (dist(centerX, centerY, s.x, s.y) + s.radius >= Radius);
}

function collide(c1, c2){
  return (dist(c1.x, c1.y, c2.x, c2.y) <= c1.radius + c2.radius);
}


