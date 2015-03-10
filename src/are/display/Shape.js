/**
* 矢量图形
*
* @class Shape
* @constructor
*/
define("ARE.Shape:ARE.DisplayObject", {
    ctor: function (width, height,debug) {
        this._super();

        this.cmds = [];

        this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
        this.width = width
        this.height = height;
        if (debug) {
            this.fillStyle("red");
            this.fillRect(0, 0, width, height);
        }
        this.cache();
    },
    end: function () {
        var ctx = this.cacheCtx;
        for (var i = 0, len = this.cmds.length; i < len; i++) {
            var cmd = this.cmds[i]
            if (this.assMethod.join("-").match(new RegExp("\\b" + cmd[0] + "\\b", "g"))) {

                ctx[cmd[0]] = cmd[1][0];
            } else {
                ctx[cmd[0]].apply(ctx, Array.prototype.slice.call(cmd[1]));
            }
        }
    },
    strokeRect: function () {
        this.cmds.push(["strokeRect", arguments]);
        return this;
    },
    fillRect: function () {

        this.cmds.push(["fillRect", arguments]);
        return this;
    },
    beginPath: function () {

        this.cmds.push(["beginPath", arguments]);
        return this;
    },
    arc: function () {

        this.cmds.push(["arc", arguments]);
        return this;
    },
    /**
     * 关闭路径
     * @method
     */
    closePath: function () {
        this.cmds.push(["closePath", arguments]);
        return this;
    },
    fillStyle: function () {
        this.cmds.push(["fillStyle", arguments]);
        return this;
    },
    fill: function () {
        this.cmds.push(["fill", arguments]);
        return this;
    },
    strokeStyle: function () {
        this.cmds.push(["strokeStyle", arguments]);
        return this;
    },
    lineWidth: function () {
        this.cmds.push(["lineWidth", arguments]);
        return this;
    },
    stroke: function () {
        this.cmds.push(["stroke", arguments]);
        return this;
    },
    moveTo: function () {
        this.cmds.push(["moveTo", arguments]);
        return this;
    },
    lineTo: function () {
        this.cmds.push(["lineTo", arguments]);
        return this;
    },
    bezierCurveTo: function () {
        this.cmds.push(["bezierCurveTo", arguments]);
        return this;
    },
    clone: function () {

    }
})