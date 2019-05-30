class Grenade {
    constructor(type, thrower, targetX, targetY){
        this.type = type;
        this.thrower = thrower;
        this.targetX = targetX;
        this.targetY = targetY;
    }

    throw(){
        this.timeCount = 0.5 + dist(targetX, targetY, player[thrower].x, player[thrower].y) / 50;
        
    }
}