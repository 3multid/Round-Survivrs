class Shooter {
  constructor(num) {
    this.num = num;
  }

  spawn(x, y) {
    this.x = x;
    this.y = y;
    this.smoke = 10;
    this.frag = 10;
    this.dir = createVector(0, 0);
    this.speed = 3;
    this.radius = 15;
    this.gunDir = createVector(centerX - this.x, centerY - this.y);
    this.hp = 100;
    this.lastShot = -reload;
    this.auto = 0;
    this.hidden = 0;
  }

  move() {
    if(GameStatus != "playing") return ;
    this.dir.x = 0;
    this.dir.y = 0;
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
    this.dir.normalize();
    this.dir.mult(this.speed);
    this.x += this.dir.x;
    this.y += this.dir.y;
    if (hitBorder(this)) {
      let hold = createVector(this.x - centerX, this.y - centerY);
      hold.normalize();
      hold.mult(this.speed);
      this.dir.sub(hold);
      this.x += this.dir.x;
      this.y += this.dir.y;
      let out = createVector(this.x - centerX, this.y - centerY);
      let fixed = createVector(this.x - centerX, this.y - centerY);
      fixed.normalize();
      fixed.mult(Radius - this.radius);
      out.sub(fixed);
      this.x -= out.x;
      this.y -= out.y;
    }
  }

  directGun(){
    if(GameStatus == "ended") return;
    if(this.auto){
      this.gunDir.set(player[3 - this.num].x - this.x, player[3 - this.num].y - this.y);
      this.gunDir.normalize();
      return;
    } 
    if(this.num == 1){
      this.gunDir.mult(10);
      for(let i = 0; i < 4; i++){
        if(keyIsDown(p1gun[i])){
          this.gunDir.add(vectorDir[i]);
        }
      }
    }
    else {
      this.gunDir.set(mouseX - this.x, mouseY - this.y);
    }
    this.gunDir.normalize();
  }

  shoot(){
    if(millis() - this.lastShot < reload || GameStatus != "playing") return ;
    if(this.auto || this.num == 1 && keyIsDown(32) || this.num == 2 && mouseIsPressed){
      let bl;
      if(this.auto){
        let enemyDir = createVector(player[3 - this.num].x - this.x, player[3 - this.num].y - this.y);
        enemyDir.normalize();
        bl = new Bullet(this.num, enemyDir, 5, 10);
      }
      else bl = new Bullet(this.num, this.gunDir, 5, 10);
      bl.shoot();
      bullet.push(bl);
      this.lastShot = millis();
    }
  }

  display() {
    push();
    fill(255);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    fill(0);
    ellipse(this.x, this.y, this.radius * 0.7, this.radius * 0.7);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.gunDir.x * this.radius * 0.75, this.y + this.gunDir.y * this.radius * 0.75);
    stroke(255, sqrt(this.hp / 100) * 255, sq(this.hp / 100) * 255);
    translate(-20, -25);
    fill(255);
    rect(this.x, this.y, 40, 5);
    noStroke();
    fill('blue');
    rect(this.x, this.y, this.hp * 0.4, 5);
    fill(0);
    rect(this.x + this.hp * 0.4, this.y, 40 - this.hp * 0.4, 5);
    pop();
  }
}
