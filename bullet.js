class Bullet {
    constructor(shooter, dir, speed, dmg){
        this.shooter = shooter;
        this.dir = dir.copy();
        this.speed = speed; // make bullet type to reduce complexity
        this.dmg = dmg; //
    }

    shoot(){
        this.radius = 3;
        let initDir = this.dir.copy().mult(10);
        this.x = player[this.shooter].x + initDir.x;
        this.y = player[this.shooter].y + initDir.y;
        this.exist = 1;
    }

    fly(){
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
        for(let i = 1; i <= 2; i ++){
            if(i == this.shooter) continue;
            if(hit(this, player[i])) {
                player[i].hp -= this.dmg;
                this.exist = 0;
            }
        }
        if(hitBorder(this)) this.exist = 0;
    }

    display(){
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}