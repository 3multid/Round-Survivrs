class Grenade {
  constructor(type, throwerX, throwerY, targetX, targetY) {
    this.type = type; // 1 is smoke, 2 is frag
    this.x = throwerX;
    this.y = throwerY;
    this.targetX = targetX;
    this.targetY = targetY;
  }

  throw() {
    this.timeCount =
      0.5 + dist(this.targetX, this.targetY, this.x, this.y) / 250;
    this.dir = createVector(this.targetX - this.x, this.targetY - this.y);
    this.dir.div(this.timeCount * FPS);
    this.timeExplode = -1;
    this.radius = 4;
    this.exist = 1;
    this.exploded = 0;
  }

  fly() {
    if (
      dist(this.x, this.y, this.targetX, this.targetY) <= this.dir.mag() / 2 ||
      this.exploded ||
      hitBorder(this)
    ) {
      if (!this.exploded) this.timeExplode = millis();
      if (this.type == 1) {
        this.smokeExplode();
      } else {
        this.fragExplode();
      }
      this.exploded = 1;
      return;
    }
    this.x += this.dir.x;
    this.y += this.dir.y;
  }

  smokeExplode() {
    let t = millis() - this.timeExplode;
    if (t < 5000) {
      this.radius = t / 50;
    } else if (t > 7500) this.exist = 0;
  }

  fragExplode() {
    if (!this.exploded) {
      this.radius = 75;
      for (let i = 1; i <= 2; i++) {
        if (hit(player[i], this)) {
          player[i].hp -=
            45 -
            (dist(player[i].x, player[i].y, this.x, this.y) / this.radius) * 30;
        }
      }
      for (let i = 0; i < 6; i++) {
        let rd = random(PI / 3);
        let ang = (PI / 3) * i + rd;
        let bl = new Bullet(
          0,
          createVector(cos(ang), sin(ang)),
          this.x,
          this.y
        );
        bl.shoot();
        bullet.push(bl);
      }
    }
    if (millis() - this.timeExplode > 2000) {
      this.exist = 0;
    }
  }

  displaySmoke() {
    if (!this.exist) return;
    push();
    if (!this.exploded) {
      stroke(0);
      fill(230);
    } else {
      noStroke();
      fill(255);
    }
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    pop();
  }

  displayFrag() {
    if (!this.exist) return;
    push();
    if (!this.exploded) {
      fill(200, 200, 0);
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      let t = (millis() - this.timeExplode) / 2000;
      noStroke();
      let circles = 30;
      for (let i = circles; i >= 1; i--) {
        fill(255, 255 - (i * 240) / circles, 0, 255 - t * 255);
        ellipse(this.x, this.y, (i * 150) / circles, (i * 150) / circles);
      }
    }
    pop();
  }
}
