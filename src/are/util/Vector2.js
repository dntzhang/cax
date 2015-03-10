/**
* 2d向量
*
* @class Vector2
* @constructor
*/
define("ARE.Vector2", {
    ctor: function (x, y) {
        this.x = x; 
        this.y = y; 
    },
    copy: function () {
        return new Vector2(this.x, this.y);
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    sqrLength: function () {
        return this.x * this.x + this.y * this.y;
    },
    normalize: function () {
        var inv = 1 / this.length();
        return new Vector2(this.x * inv, this.y * inv);
    },
    negate: function () {
        return new Vector2(-this.x, -this.y);
    },
    add: function (v) {
        this.x += v.x, this.y += v.y;
    },
    subtract: function (v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    },
    multiply: function (f) {
        return new Vector2(this.x * f, this.y * f);
    },
    divide: function (f) {
        var invf = 1 / f; return new Vector2(this.x * invf, this.y * invf);
    },
    dot: function (v) {
        return this.x * v.x + this.y * v.y;
    }
})