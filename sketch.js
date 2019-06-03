function setup() {
  createCanvas(601, 601);
  frameRate(FPS);
  for (let i = 1; i <= 2; i++) {
    player.push(new Shooter(i));
  }
  newGame();
}

function draw() {
  background(128);
  // endgame status
  for (let i = 1; i <= 2; i++) {
    if (player[i].hp <= 0) {
      push();
      textSize(40);
      textAlign(CENTER);
      fill(0);
      if (player[2].hp <= 0) text("Player 1 wins!", centerX, centerY - 30);
      else text("Player 2 wins!", centerX, centerY - 30);
      text("Press Enter to play again.", centerX, centerY + 40);
      pop();
      GameStatus = "ended";
      return;
    }
  }
  // handle shooters
  for (let i = 1; i <= 2; i++) {
    player[i].move();
    player[i].directGun();
    player[i].shoot();
    player[i].frag = max(0, player[i].frag - 1 / FPS);
    player[i].smoke = max(0, player[i].smoke - 1 / FPS);
  }
  // hold grenade
  if (keyIsDown(69) && player[1].holding == 1) {
    player[1].holdGrenade(1);
  } else if (keyIsDown(82) && player[1].holding == 2) {
    player[1].holdGrenade(2);
  } else if ((keyIsDown(96) || keyIsDown(48)) && player[2].holding == 1) {
    player[2].holdGrenade(1);
  } else if ((keyIsDown(110) || keyIsDown(190)) && player[2].holding == 2) {
    player[2].holdGrenade(2);
  }
  // display border
  push();
  fill(180);
  ellipse(centerX, centerY, Radius * 2, Radius * 2);
  pop();
  // display shooters
  for (let i = 1; i <= 2; i++) {
    player[i].outerDisplay();
    player[i].display();
  }
  // when game is ready, countdown
  if (GameStatus == "ready") {
    let t = millis() - timeStart;
    push();
    textSize(30);
    if (t < 3000) {
      let tx = 4 + floor(-t / 1000);
      text(tx.toString(), centerX - 10, centerY + 10);
    } else if (t < 4000) text("Shoot!", centerX - 45, centerY + 10);
    else GameStatus = "playing";
    pop();
  }
  // handle bullets
  for (let i = 0; i < bullet.length; i++) {
    bullet[i].fly();
    bullet[i].lifeTime -= 1 / FPS;
    bullet[i].display();
  }
  bullet = bullet.filter(x => x.exist);
  // handle grenades
  for (let i = 0; i < grenade.length; i++) {
    grenade[i].fly();
    grenade[i].lifeTime -= 1 / FPS;
    if (grenade[i].type == 1) grenade[i].displaySmoke();
    else grenade[i].displayFrag();
  }
  grenade = grenade.filter(x => x.exist);
}

function keyPressed() {
  if (keyCode == 13 && GameStatus == "ended") {
    newGame();
    return;
  }
  // switch auto mode
  if (keyCode == 81) player[1].auto = !player[1].auto;
  else if (keyCode == 8) player[2].auto = !player[2].auto;
  if (GameStatus != "playing") return;
  // start holding a grenade
  if (key == "e" && player[1].smoke == 0) {
    player[1].timeHold = millis();
    player[1].holding = 1;
  } else if (key == "r" && player[1].frag == 0) {
    player[1].timeHold = millis();
    player[1].holding = 2;
  } else if (key == "0" && player[2].smoke == 0) {
    player[2].timeHold = millis();
    player[2].holding = 1;
  } else if (key == "." && player[2].frag == 0) {
    player[2].timeHold = millis();
    player[2].holding = 2;
  }
  return;
}

function keyReleased() {
  if (GameStatus != "playing") return;
  // throw grenade
  if (key == "e" && player[1].holding == 1) {
    player[1].smoke = smokeCD;
    player[1].throwGrenade();
  } else if (key == "r" && player[1].holding == 2) {
    player[1].frag = fragCD;
    player[1].throwGrenade();
  } else if (key == "0" && player[2].holding == 1) {
    player[2].smoke = smokeCD;
    player[2].throwGrenade();
  } else if (key == "." && player[2].holding == 2) {
    player[2].frag = fragCD;
    player[2].throwGrenade();
  }
  return false;
}

function newGame() {
  player[1].spawn(150, 150);
  player[2].spawn(450, 450);
  bullet = [];
  grenade = [];
  GameStatus = "ready";
  timeStart = millis();
}

function hitBorder(s) {
  return dist(centerX, centerY, s.x, s.y) + s.radius >= Radius;
}

function hit(c1, c2) {
  return dist(c1.x, c1.y, c2.x, c2.y) <= c1.radius + c2.radius;
}

function fixToBorder(s) {
  let out = createVector(s.x - centerX, s.y - centerY);
  let fixed = createVector(s.x - centerX, s.y - centerY);
  fixed.normalize();
  fixed.mult(Radius - s.radius);
  out.sub(fixed);
  s.x -= out.x;
  s.y -= out.y;
}

