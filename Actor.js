function Actor(boundingBox, velocityX, velocityY, solid) {
    this.boundingBox = boundingBox;
    this.velocityX = velocityX || 0;
    this.velocityY = velocityY || 0;
    this.solid = !!solid;
    this.id = Actor.prototype.nextId++;
}

Actor.prototype.setBoundingBox = function(boundingBox) {
    this.boundingBox = boundingBox;
}

Actor.prototype.setVelocity = function(velocityX, velocityY) {
    this.velocityX = velocityX;
    this.velocityY = velocityY;
}

Actor.prototype.draw = function(context) {
    var box = this.boundingBox;
    // TODO: Better culling (but the culling is very important - this function vastly dominates CPU usage without it)
    if(box.x + box.halfWidth > 0 && box.x - box.halfWidth < 1024 && box.y + box.halfHeight > 0 && box.y - box.halfHeight < 768) {
        if(this.solid) context.strokeStyle = '#505050';
        else context.strokeStyle = '#a00000';
        context.strokeRect(box.x - box.halfWidth, box.y - box.halfHeight, box.halfWidth * 2, box.halfHeight * 2);
    }
}

Actor.prototype.move = function(grid, deltaTime) {
    if(this.velocityX !== 0 || this.velocityY !== 0) {
        var deltaX = this.velocityX * deltaTime;
        var deltaY = this.velocityY * deltaTime;
        var moved = false;
        while(deltaX !== 0 || deltaY !== 0) {
            var stepX = deltaX;
            var stepY = deltaY;
            if(deltaTime < 1.0 && Math.max(Math.abs(stepX), Math.abs(stepY)) > this.resolution) {
                var factor = this.resolution / Math.max(Math.abs(stepX), Math.abs(stepY));
                stepX *= factor;
                stepY *= factor;
                console.log("factor: " + factor + ", x: " + stepX + ", y: " + stepY);
            }
            var box = this.boundingBox.extendedBy(stepX, stepY);
            var actors = grid.find(box, Actor.getUniqueId);
            
            var newX = this.moveX(actors, stepX);
            if(newX !== this.boundingBox.x) {
                if(!moved) grid.remove(this.boundingBox, this);
                this.boundingBox.x = newX;
                moved = true;
            }
            
            var newY = this.moveY(actors, stepY);
            if(newY !== this.boundingBox.y) {
                if(!moved) grid.remove(this.boundingBox, this);
                this.boundingBox.y = newY;
                moved = true;
            }
            
            deltaX -= stepX;
            deltaY -= stepY;
        }
        if(moved && this.solid) grid.insert(this.boundingBox, this);
    }
}

Actor.prototype.moveX = function(actors, delta) {
    if(delta == 0) return this.boundingBox.x;
    var box = this.boundingBox.extendedBy(delta, 0);
    var half = this.boundingBox.halfWidth;
    var result = this.boundingBox.x + delta;
    for(var i = 0; i < actors.length; i++) {
        var that = actors[i];
        if(this !== that && box.intersects(that.boundingBox)) {
            var thatBox = that.boundingBox;
            if(delta > 0 && thatBox.x - thatBox.halfWidth < result + half) {
                result = thatBox.x - thatBox.halfWidth - half - this.epsilon;
            } else if(delta < 0 && thatBox.x + thatBox.halfWidth > result - half) {
                result = thatBox.x + thatBox.halfWidth + half + this.epsilon;
            }
            this.velocityX = 0;
        }
    }
    return result;
}

Actor.prototype.moveY = function(actors, delta) {
    if(delta == 0) return this.boundingBox.y;
    var box = this.boundingBox.extendedBy(0, delta);
    var half = this.boundingBox.halfHeight;
    var result = this.boundingBox.y + delta;
    for(var i = 0; i < actors.length; i++) {
        var that = actors[i];
        if(this !== that && box.intersects(that.boundingBox)) {
            var thatBox = that.boundingBox;
            if(delta > 0 && thatBox.y - thatBox.halfHeight < result + half) {
                result = thatBox.y - thatBox.halfHeight - half - this.epsilon;
            } else if(delta < 0 && thatBox.y + thatBox.halfHeight > result - half) {
                result = thatBox.y + thatBox.halfHeight + half + this.epsilon;
            }
            this.velocityY = 0;
        }
    }
    return result;
}

Actor.prototype.resolution = 10;
Actor.prototype.epsilon = 0.1;
Actor.prototype.nextId = 1;

Actor.getUniqueId = function(actor) { return actor.id; };
