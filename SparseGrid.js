function SparseGrid(columnWidth, rowHeight) {
    this.columnWidth = columnWidth;
    this.rowHeight = rowHeight;
    this.grid = {};
};

SparseGrid.prototype.insert = function(boundingBox, value) {
    this.eachCell(boundingBox, function(old, x, y, key) {
        if(old == null) {
            old = [value];
            this.grid[key] = old;
        } else if(old.indexOf(value) == -1) {
            old.push(value);
        }
    }.bind(this));
};

SparseGrid.prototype.remove = function(boundingBox, value) {
    this.eachCell(boundingBox, function(old, x, y, key) {
        if(old != null) {
            var i = old.indexOf(value);
            if(i != -1) {
                if(old.length == 1) delete this.grid[key];
                else old.splice(i, 1);
            }
        }
    }.bind(this));
};

SparseGrid.prototype.find = function(boundingBox, getUniqueId) {
    var found = {};
    var result = [];
    this.eachCell(boundingBox, function(old, x, y, key) {
        if(old != null) {
            for(var i = 0; i < old.length; i++) {
                var value = old[i];
                if(getUniqueId == null) {
                    result.push(value);
                } else {
                    var k = getUniqueId(value);
                    if(!found[k]) {
                        result.push(value);
                        found[k] = true;
                    }
                }
            }
        }
    }.bind(this));
    return result;
};

SparseGrid.prototype.eachCell = function(boundingBox, callback) {
    var minX = Math.floor((boundingBox.x - boundingBox.halfWidth) / this.columnWidth);
    var maxX = Math.floor((boundingBox.x + boundingBox.halfWidth) / this.columnWidth);
    var minY = Math.floor((boundingBox.y - boundingBox.halfHeight) / this.rowHeight);
    var maxY = Math.floor((boundingBox.y + boundingBox.halfHeight) / this.rowHeight);
    for(var x = minX; x <= maxX; x++) {
        for(var y = minY; y <= maxY; y++) {
            var key = x + ',' + y;
            callback(this.grid[key], x, y, key);
        }
    }
};
