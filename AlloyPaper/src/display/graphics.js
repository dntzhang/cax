
//begin-------------------AlloyPaper.Graphics---------------------begin

AlloyPaper.Graphics = AlloyPaper.DisplayObject.extend({
    "ctor": function() {
        this._super();
        this.cmds = [];
        this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];

        this.currentGradient = null;
    },
    "draw": function(ctx) {
        for (var i = 0, len = this.cmds.length; i < len; i++) {
            var cmd = this.cmds[i], methodName = cmd[0];
            if (this.assMethod.join("-").match(new RegExp("\\b" + methodName + "\\b", "g"))) {
                ctx[methodName] = cmd[1][0];
            } else if (methodName === "addColorStop") {
                this.currentGradient && this.currentGradient.addColorStop(cmd[1][0], cmd[1][1]);
            } else if(methodName ==="fillGradient"){
                ctx.fillStyle = this.currentGradient;
            }else {
                var result = ctx[methodName].apply(ctx, Array.prototype.slice.call(cmd[1]));
                if (methodName === "createRadialGradient" || methodName === "createLinearGradient") {
                    this.currentGradient = result;
                }
                
            }
        }
    },
    "clearRect": function(x, y, width, height) {
        this.cmds.push(["clearRect", arguments]);
        return this;
    },
    "clear": function() {
        this.cmds.length = 0;
        return this;
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
    "createRadialGradient": function () {
        this.cmds.push(["createRadialGradient", arguments]);
        return this;
    },
    "createLinearGradient": function () {
        this.cmds.push(["createLinearGradient", arguments]);
        return this;
    },
    "addColorStop": function () {
        this.cmds.push(["addColorStop", arguments]);
        return this;
    },
    "fillGradient": function () {
        this.cmds.push(["fillGradient"]);
        return this;
    },
    "clone": function () {

    }
});

//end-------------------AlloyPaper.Graphics---------------------end
