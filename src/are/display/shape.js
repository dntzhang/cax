
//begin-------------------ARE.Shape---------------------begin

ARE.Shape = ARE.DisplayObject.extend({
    "ctor": function(width, height, debug) {
        this._super();
        this.cmds = [];
        this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
        this.width = width;
        this.height = height;
        this._width = width;
        this._height = height;
        this.shapeCanvas = document.createElement("canvas");
        this.shapeCanvas.width = this.width;
        this.shapeCanvas.height = this.height;
        this.shapeCtx = this.shapeCanvas.getContext("2d");
        if (debug) {
            this.fillStyle("red");
            this.fillRect(0, 0, width, height);
        }
        this._watch(this, "scaleX", function(prop, value) {
            this.width = this._width * value;
            this.height = this._height * this.scaleY;
            this.originX = this.originX;
            this.shapeCanvas.width = this.width;
            this.shapeCanvas.height = this.height;
            this.shapeCtx.scale(value, this.scaleY);
            this.end();
        });
        this._watch(this, "scaleY", function(prop, value) {
            this.width = this._width * this.scaleX;
            this.height = this._height * value;
            this.originY = this.originY;
            this.shapeCanvas.width = this.width;
            this.shapeCanvas.height = this.height;
            this.shapeCtx.scale(this.scaleX, value);
            this.end();
        });
    },
    "end": function() {
        this.cacheID = ARE.UID.getCacheID();
        var ctx = this.shapeCtx;
        for (var i = 0, len = this.cmds.length; i < len; i++) {
            var cmd = this.cmds[i];
            if (this.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {
                ctx[cmd[0]] = cmd[1][0];
            } else {
                ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
            }
        }
    },
    "clearRect": function(x, y, width, height) {
        this.cacheID = ARE.UID.getCacheID();
        this.shapeCtx.clearRect(x, y, width, height);
    },
    "clear": function() {
        this.cacheID = ARE.UID.getCacheID();
        this.shapeCtx.clearRect(0, 0, this.width, this.height);
    },
    "strokeRect": function() {
        this.cmds.push(["strokeRect", arguments]);
        return this;
    },
    "fillRect": function() {
        this.cmds.push(["fillRect", arguments]);
        return this;
    },
    "beginPath": function() {
        this.cmds.push(["beginPath", arguments]);
        return this;
    },
    "arc": function() {
        this.cmds.push(["arc", arguments]);
        return this;
    },
    "closePath": function() {
        this.cmds.push(["closePath", arguments]);
        return this;
    },
    "fillStyle": function() {
        this.cmds.push(["fillStyle", arguments]);
        return this;
    },
    "fill": function() {
        this.cmds.push(["fill", arguments]);
        return this;
    },
    "strokeStyle": function() {
        this.cmds.push(["strokeStyle", arguments]);
        return this;
    },
    "lineWidth": function() {
        this.cmds.push(["lineWidth", arguments]);
        return this;
    },
    "stroke": function() {
        this.cmds.push(["stroke", arguments]);
        return this;
    },
    "moveTo": function() {
        this.cmds.push(["moveTo", arguments]);
        return this;
    },
    "lineTo": function() {
        this.cmds.push(["lineTo", arguments]);
        return this;
    },
    "bezierCurveTo": function() {
        this.cmds.push(["bezierCurveTo", arguments]);
        return this;
    },
    "clone": function() {}
});

//end-------------------ARE.Shape---------------------end
