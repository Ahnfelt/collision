function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
}

BoundingBox.prototype.intersects = function(that) {
    return (
        Math.abs(this.x - that.x) < (this.halfWidth + that.halfWidth) &&
        Math.abs(this.y - that.y) < (this.halfHeight + that.halfHeight)
    );
};

BoundingBox.prototype.extendedBy = function(x, y) {
    return new BoundingBox(
        this.x + x / 2,
        this.y + y / 2,
        this.halfWidth * 2 + Math.abs(x),
        this.halfHeight * 2 + Math.abs(y)
    );
};
