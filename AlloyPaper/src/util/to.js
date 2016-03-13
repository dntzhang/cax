
//begin-------------------AlloyPaper.To---------------------begin

AlloyPaper.To = Class.extend({
    "statics": {
        "ctor": function () {
            this.bounceOut = AlloyPaper.TWEEN.Easing.Bounce.Out,
            this.linear = AlloyPaper.TWEEN.Easing.Linear.None,
            this.quadraticIn = AlloyPaper.TWEEN.Easing.Quadratic.In,
            this.quadraticOut = AlloyPaper.TWEEN.Easing.Quadratic.Out,
            this.quadraticInOut = AlloyPaper.TWEEN.Easing.Quadratic.InOut,
            this.cubicIn = AlloyPaper.TWEEN.Easing.Cubic.In,
            this.cubicOut = AlloyPaper.TWEEN.Easing.Cubic.Out,
            this.cubicInOut = AlloyPaper.TWEEN.Easing.Cubic.InOut,
            this.quarticIn = AlloyPaper.TWEEN.Easing.Quartic.In,
            this.quarticOut = AlloyPaper.TWEEN.Easing.Quartic.Out,
            this.quarticInOut = AlloyPaper.TWEEN.Easing.Quartic.InOut,
            this.quinticIn = AlloyPaper.TWEEN.Easing.Quintic.In,
            this.quinticOut = AlloyPaper.TWEEN.Easing.Quintic.Out,
            this.quinticInOut = AlloyPaper.TWEEN.Easing.Quintic.InOut,
            this.sinusoidalIn = AlloyPaper.TWEEN.Easing.Sinusoidal.In,
            this.sinusoidalOut = AlloyPaper.TWEEN.Easing.Sinusoidal.Out,
            this.sinusoidalInOut = AlloyPaper.TWEEN.Easing.Sinusoidal.InOut,
            this.exponentialIn = AlloyPaper.TWEEN.Easing.Exponential.In,
            this.exponentialOut = AlloyPaper.TWEEN.Easing.Exponential.Out,
            this.exponentialInOut = AlloyPaper.TWEEN.Easing.Exponential.InOut,
            this.circularIn = AlloyPaper.TWEEN.Easing.Circular.In,
            this.circularOut = AlloyPaper.TWEEN.Easing.Circular.Out,
            this.circularInOut = AlloyPaper.TWEEN.Easing.Circular.InOut,
            this.elasticIn = AlloyPaper.TWEEN.Easing.Elastic.In,
            this.elasticOut = AlloyPaper.TWEEN.Easing.Elastic.Out,
            this.elasticInOut = AlloyPaper.TWEEN.Easing.Elastic.InOut,
            this.backIn = AlloyPaper.TWEEN.Easing.Back.In,
            this.backOut = AlloyPaper.TWEEN.Easing.Back.Out,
            this.backInOut = AlloyPaper.TWEEN.Easing.Back.InOut,
            this.bounceIn = AlloyPaper.TWEEN.Easing.Bounce.In,
            this.bounceOut = AlloyPaper.TWEEN.Easing.Bounce.Out,
            this.bounceInOut = AlloyPaper.TWEEN.Easing.Bounce.InOut,
            this.interpolationLinear = AlloyPaper.TWEEN.Interpolation.Linear,
            this.interpolationBezier = AlloyPaper.TWEEN.Interpolation.Bezier,
            this.interpolationCatmullRom = AlloyPaper.TWEEN.Interpolation.CatmullRom;
        },
        "get": function (element) {
            var to = new this(element);
            var stage = this.getStage(element);
            stage && stage.toList.push(to);
            return to;
        },
        "getStage": function (element) {
            if (!element.parent) return;
            if (element.parent instanceof AlloyPaper.Stage) {
                return element.parent;
            } else {
                return this.getStage(element.parent);
            }
        }
    },
    "ctor": function(element) {
        this.element = element;
        this.cmds = [];
        this.index = 0;
        this.tweens = [];
        this._pause = false;
        this.loop = setInterval(function() {
            AlloyPaper.TWEEN.update();
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
        if (this._pause) return;
        var len = this.cmds.length;
        if (this.index < len) {
            this.exec(this.cmds[this.index], this.index == len - 1);
        } else {
            clearInterval(this.loop);
        }
        return this;
    },
    "pause": function() {
        this._pause = true;
        for (var i = 0, len = this.tweens.length; i < len; i++) {
            this.tweens[i].pause();
        }
        if (this.currentTask == "wait") {
            this.timeout -= new Date() - this.currentTaskBegin;
            this.currentTaskBegin = new Date();
        }
    },
    "toggle": function() {
        if (this._pause) {
            this.play();
        } else {
            this.pause();
        }
    },
    "play": function() {
        this._pause = false;
        for (var i = 0, len = this.tweens.length; i < len; i++) {
            this.tweens[i].play();
        }
        var self = this;
        if (this.currentTask == "wait") {
            setTimeout(function() {
                if (self._pause) return;
                self.index++;
                self.start();
                if (self.index == self.cmds.length && self.complete) self.complete();
            }, this.timeout);
        }
    },
    "stop": function () {
        for (var i = 0, len = this.tweens.length; i < len; i++) {
            this.tweens[i].pause();
            AlloyPaper.TWEEN.remove(this.tweens[i]);
        }
        this.cmds.length = 0;

    },
    "exec": function(cmd, last) {
        var len = cmd.length,
            self = this;
        this.currentTask = cmd[0];
        switch (this.currentTask) {
        case "to":
            self.stepCompleteCount = 0;
            for (var i = 1; i < len; i++) {
                var task = cmd[i];
                var ease = task[1][2];
                var target = {};
                var prop = task[0];
                target[prop] = task[1][0];
                var t = new AlloyPaper.TWEEN.Tween(this.element).to(target, task[1][1]).onStart(function() {
                    if (cmd.start) cmd.start();
                }).onUpdate(function() {
                    if (cmd.progress) cmd.progress.call(self.element);
                    self.element[prop] = this[prop];
                }).easing(ease ? ease : AlloyPaper.To.linear).onComplete(function() {
                    self.stepCompleteCount++;
                    if (self.stepCompleteCount == len - 1) {
                        if (cmd.end) cmd.end.call(self.element);
                        if (last && self.complete) self.complete();
                        self.index++;
                        self.start();
                    }
                }).start();
                this.tweens.push(t);
            }
            break;
        case "wait":
            this.currentTaskBegin = new Date();
            this.timeout = cmd[1][0];
            setTimeout(function() {
                if (self._pause) return;
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

//end-------------------AlloyPaper.To---------------------end
