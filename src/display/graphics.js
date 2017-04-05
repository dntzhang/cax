import DisplayObject from './display_object.js'

class Graphics extends DisplayObject {
    constructor(data) {
        super(data)
        this.cmds = [];
        this.assMethod = ["fillStyle", "strokeStyle", "lineWidth"];
        this.currentGradient = null;
    }

    clearRect(x, y, width, height) {
        this.cmds.push(["clearRect", arguments]);
        return this;
    }

    clear() {
        this.cmds.length = 0;
        this.beginPath();
        return this;
    }

    strokeRect() {
        this.cmds.push(["strokeRect", arguments]);
        return this;
    }

    fillRect() {
        this.cmds.push(["fillRect", arguments]);
        return this;
    }

    beginPath() {
        this.cmds.push(["beginPath", arguments]);
        return this;
    }

    arc() {
        this.cmds.push(["arc", arguments]);
        return this;
    }

    closePath() {
        this.cmds.push(["closePath", arguments]);
        return this;
    }

    fillStyle() {
        this.cmds.push(["fillStyle", arguments]);
        return this;
    }

    fill() {
        this.cmds.push(["fill", arguments]);
        return this;
    }

    strokeStyle() {
        this.cmds.push(["strokeStyle", arguments]);
        return this;
    }

    lineWidth() {
        this.cmds.push(["lineWidth", arguments]);
        return this;
    }

    stroke() {
        this.cmds.push(["stroke", arguments]);
        return this;
    }

    moveTo() {
        this.cmds.push(["moveTo", arguments]);
        return this;
    }

    lineTo() {
        this.cmds.push(["lineTo", arguments]);
        return this;
    }

    bezierCurveTo() {
        this.cmds.push(["bezierCurveTo", arguments]);
        return this;
    }

    createRadialGradient() {
        this.cmds.push(["createRadialGradient", arguments]);
        return this;
    }

    createLinearGradient() {
        this.cmds.push(["createLinearGradient", arguments]);
        return this;
    }

    addColorStop() {
        this.cmds.push(["addColorStop", arguments]);
        return this;
    }

    fillGradient() {
        this.cmds.push(["fillGradient"]);
        return this;
    }
}

export default Graphics;


