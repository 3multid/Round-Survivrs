class Bullet {
  constructor(shooter, dir, x, y) {
    this.shooter = shooter;
    this.dir = dir.copy();
    this.x = x; // make bullet type to reduce complexity
    this.y = y; //
  }

  shoot() {
    if (this.shooter) {
      this.radius = 3;
      this.speed = 5;
      this.dmg = 10;
    } else {
      this.radius = 2;
      this.speed = 7;
      this.dmg = 5;
    }
    this.exist = 1;
  }

  fly() {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
    for (let i = 1; i <= 2; i++) {
      if (i == this.shooter) continue;
      if (hit(this, player[i])) {
        player[i].hp -= this.dmg;
        this.exist = 0;
      }
    }
    if (hitBorder(this)) this.exist = 0;
  }

  display() {
    if (this.exist) {
      push();
      if (this.shooter == 1 || this.shooter == 2) fill(200, 55, 0);
      else fill(55);
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
      pop();
    }
  }
}
