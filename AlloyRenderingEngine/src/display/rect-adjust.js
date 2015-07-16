
//begin-------------------ARE.RectAdjust---------------------begin

ARE.RectAdjust = Class.extend({
    "ctor": function(option) {
        this.min = option.min;
        this.max = option.max;
        this.value = option.value;
        this.change = option.change;
        this.renderTo = option.renderTo;
        this.fillStyle = option.fillStyle;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 140;
        this.canvas.height = 16;
        this.canvas.style.cssText = "border:1px solid black;";
        this.ctx = this.canvas.getContext("2d");
        this.renderTo.appendChild(this.canvas);
        this.render(160 * (this.value - this.min) / (this.max - this.min));
        this.offset = this.canvas.getBoundingClientRect();
        var self = this;
        var isMouseDown = false;
        this.canvas.addEventListener("mousedown", function(evt) {
            isMouseDown = true;
            var x = evt.pageX - self.offset.left;
            var y = evt.pageY - self.offset.top;
            self.value = self.min + (self.max - self.min) * x / 140;
            if (self.value > self.max) self.value = self.max;
            if (self.value < self.min) self.value = self.min;
            self.change(self.value);
            self.render(x);
            evt.preventDefault();
            evt.stopPropagation();
        }, false);
        this.canvas.addEventListener("mousemove", function(evt) {
            if (isMouseDown) {
                var x = evt.pageX - self.offset.left;
                var y = evt.pageY - self.offset.top;
                self.value = self.min + (self.max - self.min) * x / 140;
                if (self.value > self.max) self.value = self.max;
                if (self.value < self.min) self.value = self.min;
                self.change(self.value);
                self.render(x);
                evt.preventDefault();
                evt.stopPropagation();
            }
        }, false);
        document.addEventListener("mouseup", function(evt) {
            isMouseDown = false;
        }, false);
    },
    "render": function(x) {
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.clearRect(0, 0, 500, 500);
        this.ctx.beginPath();
        this.ctx.fillRect(0, 0, x, 60);
    }
});

//end-------------------ARE.RectAdjust---------------------end
