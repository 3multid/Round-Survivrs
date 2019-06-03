class Shooter {
  constructor(num) {
    this.num = num;                                                   // index of the shooter
  }

  // spawn the shooter and reset some attributes
  spawn(x, y) {
    this.x = x;                                                       // initial coordinate
    this.y = y;                                                       // ---
    this.smoke = 0;                                                   // smoke grenade cooldown
    this.frag = 0;                                                    // frag grenade cooldown
    this.dir = createVector(0, 0);                                    // direction of moving
    this.speed = 3;
    this.radius = 15;                                                 // radius of the body
    this.gunDir = createVector(centerX - this.x, centerY - this.y);   // direction of shooting or throwing
    this.hp = 100;
    this.lastShot = -reload;                                          // time of the last shot
    this.auto = 0;                                                    // if 1, auto aim to the enemy location
    this.canShoot = 1;
    this.hidden = 0;                                                  // 1 if shooter is hiding in a SG
    this.timeHold = 0;                                                // last time start holding a grenade
    this.holding = 0;                                                 // type of holding grenade
    this.targetX = this.x;                                            // target of the grenade
    this.targetY = this.y;                                            // ---  
  }

  move() {
    if (GameStatus != "playing") return;
    this.dir.set(0, 0);
    // determine moving direction by pressing keys
    if (this.num == 2) {
      for (let i = 37; i <= 40; i++) {
        if (keyIsDown(i)) {
          this.dir.x += dx[i - 37];
          this.dir.y += dy[i - 37];
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        if (keyIsDown(p1move[i])) {
          this.dir.x += dx[i];
          this.dir.y += dy[i];
        }
      }
    }
    // make the moving direction's magnitude equal to shooter's speed 
    this.dir.normalize();
    this.dir.mult(this.speed);
    // move shooter by moving direction
    this.x += this.dir.x;
    this.y += this.dir.y;
    // fix moving direction and location if shooter touch the border
    if (hitBorder(this)) {
      // undo last move
      this.x -= this.dir.x;
      this.y -= this.dir.y;
      // part of the moving direction that lost by hitting the border
      let hold = createVector(this.x - centerX, this.y - centerY);
      hold.normalize();
      hold.mult(this.speed);
      // realistic moving direction
      this.dir.sub(hold);
      // move again
      this.x += this.dir.x;
      this.y += this.dir.y;
      // fix shooter's location to the border
      fixToBorder(this);
    }
  }

  // direct the gun either automatically or manually
  directGun() {
    if (GameStatus == "ended") return;
    // if auto mode is on, shoot to the enemy location
    if (this.auto) {
      this.gunDir.set(
        player[3 - this.num].x - this.x,
        player[3 - this.num].y - this.y
      );
      this.gunDir.normalize();
      return;
    }
    // manuallly change gun direction
    if (this.num == 1) {
      this.gunDir.mult(10);
      for (let i = 0; i < 4; i++) {
        if (keyIsDown(p1gun[i])) {
          this.gunDir.add(vectorDir[i]);
        }
      }
    } else {
      this.gunDir.set(mouseX - this.x, mouseY - this.y);
    }
    this.gunDir.normalize();
  }

  shoot() {
    // forbid shooting
    if (
      millis() - this.lastShot < reload ||
      GameStatus != "playing" ||
      !this.canShoot
    )
      return;
    // shoot
    if (
      this.auto ||
      (this.num == 1 && keyIsDown(32)) ||
      (this.num == 2 && mouseIsPressed)
    ) {
      let bl;
      bl = new Bullet(
        this.num,
        this.gunDir,
        this.x + this.gunDir.x * 10,
        this.y + this.gunDir.y * 10
      );
      bl.shoot();
      bullet.push(bl);
      // reload
      this.lastShot = millis();
    }
  }

  // if shooter is holding a grenade, forbid shooting, decrease its speed and increase distance to target
  holdGrenade() {
    this.canShoot = 0;
    this.speed = 1.5;
    this.targetX =
      this.x + (((millis() - this.timeHold) * this.gunDir.x) / FPS) * 25;
    this.targetY =
      this.y + (((millis() - this.timeHold) * this.gunDir.y) / FPS) * 25;
  }

  // throw holding grenade
  throwGrenade() {
    let gr = new Grenade(
      this.holding,
      this.x,
      this.y,
      this.targetX,
      this.targetY
    );
    gr.throw();
    grenade.push(gr);
    this.holding = 0;
    this.speed = 3;
    this.canShoot = 1;
  }

  // display auto mode, smoke and frag cooldown
  outerDisplay() {
    let autoX = 31,
      autoY = 31;
    let smokeX = autoX + 50,
      smokeY = autoY;
    let fragX = autoX,
      fragY = autoY + 50;
    if (this.num == 2) {
      autoX = centerX * 2 - autoX;
      autoY = centerY * 2 - autoY;
      smokeX = centerX * 2 - smokeX;
      smokeY = centerY * 2 - smokeY;
      fragX = centerX * 2 - fragX;
      fragY = centerY * 2 - fragY;
    }
    push();
    // auto mode
    stroke(0);
    strokeWeight(1);
    if (!this.auto) fill(230);
    else fill(200, 200, 55);
    ellipse(autoX, autoY, 50, 50);
    // smoke and frag
    fill(255);
    ellipse(smokeX, smokeY, 40, 40);
    ellipse(fragX, fragY, 40, 40);
    fill(200);
    // draw arcs for cooldown
    arc(
      smokeX,
      smokeY,
      40,
      40,
      -PI / 2 + (1 - this.smoke / smokeCD) * PI * 2,
      -PI / 2
    );
    arc(
      fragX,
      fragY,
      40,
      40,
      -PI / 2 + (1 - this.frag / fragCD) * PI * 2,
      -PI / 2
    );
    // text on those
    fill(0);
    noStroke();
    textSize(10);
    text("Auto", autoX - 10, autoY + 3);
    text("Frag", fragX - 10, fragY + 3);
    text("Smoke", smokeX - 15, smokeY + 3);
    pop();
  }

  // display shooter, gun and grenade target
  display() {
    push();
    fill(255);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    // launcher, color depend on weapon
    if (this.holding == 0) fill(0);
    else if (this.holding == 1) fill(230);
    else fill(200, 200, 0);
    ellipse(this.x, this.y, this.radius * 0.7, this.radius * 0.7);
    // gun
    strokeWeight(2);
    line(
      this.x,
      this.y,
      this.x + this.gunDir.x * this.radius * 0.75,
      this.y + this.gunDir.y * this.radius * 0.75
    );
    // hp bar
    stroke(255, sqrt(this.hp / 100) * 255, sq(this.hp / 100) * 255);
    translate(-20, -25);
    fill(255);
    rect(this.x, this.y, 40, 5);
    noStroke();
    fill("blue");
    rect(this.x, this.y, this.hp * 0.4, 5);
    fill(0);
    rect(this.x + this.hp * 0.4, this.y, 40 - this.hp * 0.4, 5);
    translate(20, 25);
    // grenade target
    if (this.holding) {
      stroke(0);
      line(this.targetX - 5, this.targetY, this.targetX + 5, this.targetY);
      line(this.targetX, this.targetY - 5, this.targetX, this.targetY + 5);
      fill(255);
      ellipse(this.targetX, this.targetY, 4, 4);
    }
    pop();
  }
}
