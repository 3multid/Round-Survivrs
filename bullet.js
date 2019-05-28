class Bullet {
    constructor(shooter, dir, speed, dmg){
        this.shooter = shooter;
        this.dir = dir.copy();
        this.speed = speed; // make bullet type to reduce complexity
        this.dmg = dmg; //
    }

    shoot(){
        this.radius = 3;
        let initDir = this.dir.copy().mult(this.shooter.radius / this.shooter.speed);
        this.x = this.shooter.x + initDir.x;
        this.y = this.shooter.y + initDir.y;
        this.exist = 1;
    }

    fly(){
        this.x += this.dir.x;
        this.y += this.y;
        for(let i = 1; i <= 2; i ++){
            if(i == this.shooter) continue;
            if(collide(this, Player[i])) {
                Player[i].hp -= this.dmg;
                this.exist = 0;
            }
        }
        if(hitBorder(this)) this.exist = 0;
    }

    
}