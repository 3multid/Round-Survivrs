class Grenade {
  constructor(type, throwerX, throwerY, targetX, targetY) {
    this.type = type; // 1 is smoke, 2 is frag
    this.x = throwerX; // location of thrower
    this.y = throwerY; // 
    this.targetX = targetX; // location of target
    this.targetY = targetY; //
  }

  throw() {
    // time it fly
    this.timeCount =
      0.5 + dist(this.targetX, this.targetY, this.x, this.y) / 400;
    // direction
    this.dir = createVector(this.targetX - this.x, this.targetY - this.y);
    this.dir.div(this.timeCount * FPS);
    // other
    this.lifeTime = inf;
    this.radius = 4;
    this.exist = 1;
    this.exploded = 0;
  }

  fly() {
    // explode
    if (
      dist(this.x, this.y, this.targetX, this.targetY) <= this.dir.mag() / 2 ||
      hitBorder(this)
    ) {
      if (!this.exploded){
        this.exploded = 1;
        if (this.type == 1) {
          this.lifeTime = 7.5;
        } else {
          this.lifeTime = 2;
        }
      }
      if (this.type == 1) {
          this.smokeExplode();
        } else {
          this.fragExplode();
        }
      return;
    }
    // fly
    this.x += this.dir.x;
    this.y += this.dir.y;
  }

  // after exploding, continuosly increase size of smoke
  smokeExplode() {
    if(this.lifeTime > 2.5){
      this.radius = 153 - this.lifeTime * 20;
    } else if (this.lifeTime <= 0) this.exist = 0;
  }

  // deal damage depend on distance to center and shoot some frags when explode
  fragExplode() {
    if (!this.exploded) {
      this.radius = 75;
      // deal damage
      for (let i = 1; i <= 2; i++) {
        if (hit(player[i], this)) {
          player[i].hp -=
            45 -
            (dist(player[i].x, player[i].y, this.x, this.y) / this.radius) * 30;
        }
      }
      // shoot frags
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
    if (this.lifeTime <= 0) {
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
      if(this.lifeTime > 0.5) fill(255);
      else fill(255, 255, 255, this.lifeTime * 2 * 255);
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
      noStroke();
      let circles = 30;
      for (let i = circles; i >= 1; i--) {
        fill(255, 255 - (i * 240) / circles, 0, this.lifeTime / 2 * 255);
        ellipse(this.x, this.y, (i * 150) / circles, (i * 150) / circles);
      }
    }
    pop();
  }
}
