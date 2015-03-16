function Particle(boundingBox, velocityX, velocityY) {
    Actor.call(this, boundingBox, velocityX, velocityY, false);
    var k = Math.random();
    this.size = 1.5 - k * k * 0.8;
    this.age = 0;
    var r = Math.random();
    this.maxAge = 10.0 - r * 9.0;
    var c = Math.round(220 - 60 * r);
    this.color = 'rgb(' + c + ', 0, 0)';
    this.oldX = null;
    this.oldY = null;
}

Particle.prototype = Object.create(Actor.prototype);

Particle.prototype.onCollision = function(that, bounceVelocityX, bounceVelocityY, bounceX, bounceY) { 
    if(that.solid) {
        if(Math.abs(bounceVelocityX) > this.epsilon) this.velocityX = bounceVelocityX * 0.25;
        if(Math.abs(bounceVelocityY) > this.epsilon) this.velocityY = bounceVelocityY * 0.25;
        this.applyFriction(that, bounceX, bounceY);
        return true;
    }
};

Particle.prototype.applyFriction = function(that, bounceX, bounceY) {
    var box = that.boundingBox;
    if(bounceX > box.x - box.halfWidth && bounceX < box.x + box.halfWidth) this.velocityX *= 0.9;
    if(bounceY > box.y - box.halfHeight && bounceY < box.y + box.halfHeight) this.velocityY *= 0.9;
};

Particle.prototype.onTick = function(game, deltaTime) {
    this.age += deltaTime;
    if(this.age > this.maxAge) game.remove(this);
};

Particle.prototype.draw = function(context) {
    var box = this.boundingBox;
    // TODO: Better culling (but the culling is very important - this function vastly dominates CPU usage without it)
    if(box.x + box.halfWidth > 0 && box.x - box.halfWidth < 1024 && box.y + box.halfHeight > 0 && box.y - box.halfHeight < 768) {
        var w = Math.min(box.halfWidth, box.halfWidth * (this.maxAge - this.age) * 0.20 + 0.1);
        var h = Math.min(box.halfHeight, box.halfHeight * (this.maxAge - this.age) * 0.20 + 0.1);
        var d = this.size * (w + h);
        var x = box.x;
        var y = box.y + (box.halfHeight - h);
        context.lineWidth = d;
        context.lineCap = 'round';
        context.strokeStyle = this.color;
        context.beginPath();
        context.moveTo(x, y);
        var oX = (this.oldX !== null && Math.abs(this.oldX - x) > this.epsilon) ? this.oldX : x + this.epsilon;
        var oY = (this.oldY !== null && Math.abs(this.oldY - y) > this.epsilon) ? this.oldY : y + this.epsilon;
        /*if(Math.abs(x - oX) > this.resolution || Math.abs(y - oY) > this.resolution) {
            oX = x + this.epsilon;
            oY = y + this.epsilon;
        }*/
        context.lineTo(oX, oY);
        context.stroke();
        this.oldX = x;
        this.oldY = y;
    } else {
        this.oldX = null;
        this.oldY = null;
    }
};
