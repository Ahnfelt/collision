function Game(actors) {
    this.actors = [];
    this.grid = new SparseGrid(200, 200);
    this.time = Date.now();
    if(actors != null) {
        for(var i = 0; i < actors.length; i++) {
            this.insert(actors[i]);
        }
    }
}

Game.prototype.insert = function(actor) {
    var i = this.actors.indexOf(actor);
    if(i === -1) {
        this.actors.push(actor);
        if(actor.solid) this.grid.insert(actor.boundingBox, actor);
    }
};

Game.prototype.remove = function(actor) {
    this.grid.remove(actor.boundingBox, actor);
    var i = this.actors.indexOf(actor);
    if(i !== -1) this.actors.splice(i, 1);
};

Game.prototype.tick = function() {
    var newTime = Date.now();
    var deltaTimeMs = newTime - this.time;
    this.time = newTime;
    return Math.min(100, deltaTimeMs) / 1000;
};

Game.prototype.update = function(deltaTime) {
    for(var i = 0; i < this.actors.length; i++) {
        var actor = this.actors[i];
        if(actor.move) actor.move(this.grid, deltaTime);
        if(actor.onTick) actor.onTick(this, deltaTime);
    }
};

Game.prototype.draw = function(context) {
    context.save();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for(var i = 0; i < this.actors.length; i++) {
        var actor = this.actors[i];
        actor.draw(context);
    }
    context.fillText("Objects: " + this.actors.length, 10, 10);
    context.restore();
};

Game.prototype.loop = function(context, callback) {
    var deltaTime = this.tick();
    if(callback != null) callback(this, deltaTime);
    this.update(deltaTime);
    this.draw(context);
    requestAnimationFrame(this.loop.bind(this, context, callback));
};
