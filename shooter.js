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
  }

  move() {
    if(GameStatus == "ended") return ;
    this.dir.x = 0;
    this.dir.y = 0;
    if (this.num == 2) {
      for (let i = 37; i <= 40; i++) {
        if (keyIsDown(i)) {
          this.dir.x += dx[i - 37];
          this.dir.y += dy[i - 37];
        }
      }
      this.gunDir.set(mouseX - this.x, mouseY - this.y);
    } else {
      this.gunDir.mult(10);
      for (let i = 0; i < 4; i++) {
        if (keyIsDown(p1move[i])) {
          this.dir.x += dx[i];
          this.dir.y += dy[i];
        }
        if (keyIsDown(p1gun[i])) {
          this.gunDir.add(vectorDir[i]);
        }
      }
    }
    this.gunDir.normalize();
    if(GameStatus == "ready") return ;
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

  shoot(){
    if(millis() - this.lastShot < reload || GameStatus != "playing") return ;
    if(this.num == 1 || this.num == 2 && mouseIsPressed){
      let bl = new Bullet(this.num, this.gunDir, 5, 10);
      bl.shoot();
      bullet.push(bl);
      this.lastShot = millis();
    }
  }

  display() {
    if(this.hp <= 0) return ;
    push();
    fill(255);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    fill(0);
    ellipse(this.x, this.y, this.radius * 0.7, this.radius * 0.7);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.gunDir.x * this.radius * 0.75, this.y + this.gunDir.y * this.radius * 0.75);
    pop();
  }
}
