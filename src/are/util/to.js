
//begin-------------------ARE.To---------------------begin

ARE.To = __class.extend({
    "statics": {
        "ctor": function() {
            var self = this;
            setTimeout(function() {
                self.bounceOut = ARE.TWEEN.Easing.Bounce.Out,
                self.linear = ARE.TWEEN.Easing.Linear.None,
                self.quadraticIn = ARE.TWEEN.Easing.Quadratic.In,
                self.quadraticOut = ARE.TWEEN.Easing.Quadratic.Out,
                self.quadraticInOut = ARE.TWEEN.Easing.Quadratic.InOut,
                self.cubicIn = ARE.TWEEN.Easing.Cubic.In,
                self.cubicOut = ARE.TWEEN.Easing.Cubic.Out,
                self.cubicInOut = ARE.TWEEN.Easing.Cubic.InOut,
                self.quarticIn = ARE.TWEEN.Easing.Quartic.In,
                self.quarticOut = ARE.TWEEN.Easing.Quartic.Out,
                self.quarticInOut = ARE.TWEEN.Easing.Quartic.InOut,
                self.quinticIn = ARE.TWEEN.Easing.Quintic.In,
                self.quinticOut = ARE.TWEEN.Easing.Quintic.Out,
                self.quinticInOut = ARE.TWEEN.Easing.Quintic.InOut,
                self.sinusoidalIn = ARE.TWEEN.Easing.Sinusoidal.In,
                self.sinusoidalOut = ARE.TWEEN.Easing.Sinusoidal.Out,
                self.sinusoidalInOut = ARE.TWEEN.Easing.Sinusoidal.InOut,
                self.exponentialIn = ARE.TWEEN.Easing.Exponential.In,
                self.exponentialOut = ARE.TWEEN.Easing.Exponential.Out,
                self.exponentialInOut = ARE.TWEEN.Easing.Exponential.InOut,
                self.circularIn = ARE.TWEEN.Easing.Circular.In,
                self.circularOut = ARE.TWEEN.Easing.Circular.Out,
                self.circularInOut = ARE.TWEEN.Easing.Circular.InOut,
                self.elasticIn = ARE.TWEEN.Easing.Elastic.In,
                self.elasticOut = ARE.TWEEN.Easing.Elastic.Out,
                self.elasticInOut = ARE.TWEEN.Easing.Elastic.InOut,
                self.backIn = ARE.TWEEN.Easing.Back.In,
                self.backOut = ARE.TWEEN.Easing.Back.Out,
                self.backInOut = ARE.TWEEN.Easing.Back.InOut,
                self.bounceIn = ARE.TWEEN.Easing.Bounce.In,
                self.bounceOut = ARE.TWEEN.Easing.Bounce.Out,
                self.bounceInOut = ARE.TWEEN.Easing.Bounce.InOut,
                self.interpolationLinear = ARE.TWEEN.Interpolation.Linear,
                self.interpolationBezier = ARE.TWEEN.Interpolation.Bezier,
                self.interpolationCatmullRom = ARE.TWEEN.Interpolation.CatmullRom;
            }, 0);
        },
        "get": function(element) {
            return new this(element);
        }
    },
    "ctor": function(element) {
        this.element = element;
        this.cmds = [];
        this.index = 0;
        this.loop = setInterval(function() {
            ARE.TWEEN.update();
        }, 15);
        this.cycleCount = 0;
    },
    "to": function() {
        this.cmds.push(["to"]);
        return this;
    },
    "set": function(prop, value, time, ease) {
        this.cmds[this.cmds.length - 1].push([prop, [value, time, ease]]);
        return this;
    },
    "x": function() {
        this.cmds[this.cmds.length - 1].push(["x", arguments]);
        return this;
    },
    "y": function() {
        this.cmds[this.cmds.length - 1].push(["y", arguments]);
        return this;
    },
    "z": function() {
        this.cmds[this.cmds.length - 1].push(["z", arguments]);
        return this;
    },
    "rotation": function() {
        this.cmds[this.cmds.length - 1].push(["rotation", arguments]);
        return this;
    },
    "scaleX": function() {
        this.cmds[this.cmds.length - 1].push(["scaleX", arguments]);
        return this;
    },
    "scaleY": function() {
        this.cmds[this.cmds.length - 1].push(["scaleY", arguments]);
        return this;
    },
    "skewX": function() {
        this.cmds[this.cmds.length - 1].push(["skewX", arguments]);
        return this;
    },
    "skewY": function() {
        this.cmds[this.cmds.length - 1].push(["skewY", arguments]);
        return this;
    },
    "originX": function() {
        this.cmds[this.cmds.length - 1].push(["originX", arguments]);
        return this;
    },
    "originY": function() {
        this.cmds[this.cmds.length - 1].push(["originY", arguments]);
        return this;
    },
    "alpha": function() {
        this.cmds[this.cmds.length - 1].push(["alpha", arguments]);
        return this;
    },
    "begin": function(fn) {
        this.cmds[this.cmds.length - 1].begin = fn;
        return this;
    },
    "progress": function(fn) {
        this.cmds[this.cmds.length - 1].progress = fn;
        return this;
    },
    "end": function(fn) {
        this.cmds[this.cmds.length - 1].end = fn;
        return this;
    },
    "wait": function() {
        this.cmds.push(["wait", arguments]);
        return this;
    },
    "then": function() {
        this.cmds.push(["then", arguments]);
        return this;
    },
    "cycle": function() {
        this.cmds.push(["cycle", arguments]);
        return this;
    },
    "shake": function() {
        this.cmds = this.cmds.concat([["to", ["x", {
            "0": 10,
            "1": 50}]], ["to", ["x", {
            "0": -10,
            "1": 50}]], ["to", ["x", {
            "0": 10,
            "1": 50}]], ["to", ["x", {
            "0": -10,
            "1": 50}]], ["to", ["x", {
            "0": 10,
            "1": 50}]], ["to", ["x", {
            "0": -10,
            "1": 50}]], ["to", ["x", {
            "0": 10,
            "1": 50}]], ["to", ["x", {
            "0": -10,
            "1": 50}]], ["to", ["x", {
            "0": 10,
            "1": 50}]], ["to", ["x", {
            "0": -10,
            "1": 50}]], ["to", ["x", {
            "0": 10,
            "1": 50}]], ["to", ["x", {
            "0": 0,
            "1": 50}]]]);
        return this;
    },
    "rubber": function() {
        this.cmds = this.cmds.concat([["to", ["scaleX", {
            "0": 1.25,
            "1": 300}], ["scaleY", {
            "0": .75,
            "1": 300}]], ["to", ["scaleX", {
            "0": .75,
            "1": 100}], ["scaleY", {
            "0": 1.25,
            "1": 100}]], ["to", ["scaleX", {
            "0": 1.15,
            "1": 100}], ["scaleY", {
            "0": .85,
            "1": 100}]], ["to", ["scaleX", {
            "0": .95,
            "1": 150}], ["scaleY", {
            "0": 1.05,
            "1": 150}]], ["to", ["scaleX", {
            "0": 1.05,
            "1": 100}], ["scaleY", {
            "0": .95,
            "1": 100}]], ["to", ["scaleX", {
            "0": 1,
            "1": 250}], ["scaleY", {
            "0": 1,
            "1": 250}]]]);
        return this;
    },
    "bounceIn": function() {
        this.cmds = this.cmds.concat([["to", ["scaleX", {
            "0": 0,
            "1": 0}], ["scaleY", {
            "0": 0,
            "1": 0}]], ["to", ["scaleX", {
            "0": 1.35,
            "1": 200}], ["scaleY", {
            "0": 1.35,
            "1": 200}]], ["to", ["scaleX", {
            "0": .9,
            "1": 100}], ["scaleY", {
            "0": .9,
            "1": 100}]], ["to", ["scaleX", {
            "0": 1.1,
            "1": 100}], ["scaleY", {
            "0": 1.1,
            "1": 100}]], ["to", ["scaleX", {
            "0": .95,
            "1": 100}], ["scaleY", {
            "0": .95,
            "1": 100}]], ["to", ["scaleX", {
            "0": 1,
            "1": 100}], ["scaleY", {
            "0": 1,
            "1": 100}]]]);
        return this;
    },
    "flipInX": function() {
        this.cmds = this.cmds.concat([["to", ["rotateX", {
            "0": -90,
            "1": 0}]], ["to", ["rotateX", {
            "0": 20,
            "1": 300}]], ["to", ["rotateX", {
            "0": -20,
            "1": 300}]], ["to", ["rotateX", {
            "0": 10,
            "1": 300}]], ["to", ["rotateX", {
            "0": -5,
            "1": 300}]], ["to", ["rotateX", {
            "0": 0,
            "1": 300}]]]);
        return this;
    },
    "zoomOut": function() {
        this.cmds = this.cmds.concat([["to", ["scaleX", {
            "0": 0,
            "1": 400}], ["scaleY", {
            "0": 0,
            "1": 400}]]]);
        return this;
    },
    "start": function() {
        var len = this.cmds.length;
        if (this.index < len) {
            this.exec(this.cmds[this.index], this.index == len - 1);
        } else {
            clearInterval(this.loop);
        }
    },
    "exec": function(cmd, last) {
        var len = cmd.length,
            self = this;
        switch (cmd[0]) {
        case "to":
            self.stepCompleteCount = 0;
            for (var i = 1; i < len; i++) {
                var task = cmd[i];
                var ease = task[1][2];
                var target = {};
                var prop = task[0];
                target[prop] = task[1][0];
                var t = new ARE.TWEEN.Tween(this.element).to(target, task[1][1]).onStart(function() {
                    if (cmd.start) cmd.start();
                }).onUpdate(function() {
                    if (cmd.progress) cmd.progress.call(self.element);
                    self.element[prop] = this[prop];
                }).easing(ease ? ease : ARE.To.linear).onComplete(function() {
                    self.stepCompleteCount++;
                    if (self.stepCompleteCount == len - 1) {
                        if (cmd.end) cmd.end.call(self.element);
                        if (last && self.complete) self.complete();
                        self.index++;
                        self.start();
                    }
                }).start();
            }
            break;
        case "wait":
            setTimeout(function() {
                self.index++;
                self.start();
                if (last && self.complete) self.complete();
            }, cmd[1][0]);
            break;
        case "then":
            var arg = cmd[1][0];
            arg.index = 0;
            arg.complete = function() {
                self.index++;
                self.start();
                if (last && self.complete) self.complete();
            };
            arg.start();
            break;
        case "cycle":
            var count = cmd[1][1];
            if (count && self.cycleCount == count) {
                self.index++;
                self.start();
                if (last && self.complete) self.complete();
            } else {
                self.cycleCount++;
                self.index = cmd[1][0];
                self.start();
            }
            break;
        }
    }
});

//end-------------------ARE.To---------------------end
