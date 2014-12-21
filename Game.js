function Game(actors) {
    this.actors = actors;
    this.grid = new SparseGrid(200, 200);
    for(var i = 0; i < this.actors.length; i++) {
        var actor = this.actors[i];
        this.grid.insert(actor.boundingBox, actor);
    }
    this.time = Date.now();
}

Game.prototype.tick = function() {
    var newTime = Date.now();
    var deltaTimeMs = newTime - this.time;
    this.time = newTime;
    return deltaTimeMs / 1000;
};

Game.prototype.update = function(deltaTime) {
    for(var i = 0; i < this.actors.length; i++) {
        var actor = this.actors[i];
        actor.move(this.grid, deltaTime);
    }
}

Game.prototype.draw = function(context) {
    context.save();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for(var i = 0; i < this.actors.length; i++) {
        var actor = this.actors[i];
        actor.draw(context);
    }
    context.restore();
}

Game.prototype.loop = function(context, callback) {
    var deltaTime = this.tick();
    if(callback != null) callback(this, deltaTime);
    this.update(deltaTime);
    this.draw(context);
    requestAnimationFrame(this.loop.bind(this, context, callback));
}
