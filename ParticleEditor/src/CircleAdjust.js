; (function () {
    var CircleAdjust = function (option) {
        this.min = option.min;
        this.max = option.max;
        this.rotation = option.rotation;
        this.value = option.value;
        this.change = option.change;
        this.renderTo = option.renderTo;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = 160;
        this.ctx = this.canvas.getContext("2d");
        this.angleRange = option.angleRange;
        this.renderTo.appendChild(this.canvas);
        if (this.angleRange) {
            this.setRange(this.angleRange)
        } else {
            this.render()
        };

        this.offset = this.canvas.getBoundingClientRect();
        var self=this;
        this.canvas.addEventListener("click", function (evt) {
            var x = evt.pageX - self.offset.left;
            var y = evt.pageY - self.offset.top;
            var sqrDist = Math.pow(Math.pow((x - 80), 2) + Math.pow((y - 80), 2), 0.5);
            var ag = 180 * Math.atan((y - 80) / (x - 80)) / Math.PI;

            if (ag >= 0 && x - 80 >= 0&&y-80>=0) {
                self.rotation = ag ;
            } else if (ag >= 0 && x - 80 < 0 && y - 80<0) {
                self.rotation = 180 + ag;
            } else if (ag < 0 && x - 80 <= 0 && y - 80 >= 0) {
                self.rotation =90+90 + ag;
            } else if (ag < 0 && x - 80 > 0 && y - 80 < 0) {
                self.rotation =360+ ag ;
            }
            self.value = self.min + (self.max - self.min) * sqrDist / 80;
            self.change(self.value, self.rotation);
            if (self.angleRange) {
                self.setRange(self.angleRange)
            } else {
                self.render()
            };
        }, false);
    };

    CircleAdjust.prototype = {
        setRange: function (angle) {
            this.angleRange = angle;
            this.render();
            this.ctx.beginPath()
            this.ctx.lineWidth = 1;
            this.ctx.arc(80, 80, this.r, (this.rotation - (angle / 2)) * Math.PI / 180, (this.rotation + (angle / 2) )* Math.PI / 180, false);
            this.ctx.stroke();
        },
        render: function () {

            this.ctx.clearRect(0, 0, 500, 500)
           
            this.ctx.beginPath()
            this.ctx.lineWidth = 1;
            this.ctx.arc(80, 80, 80, 0, 2 * Math.PI, false)
            this.ctx.stroke();
            this.ctx.beginPath()
            this.ctx.lineWidth = 4;
            this.ctx.moveTo(80, 80);
            this.x=80 + (80 * (this.value - this.min) / (this.max - this.min)) * Math.cos(this.rotation * Math.PI / 180);
            this.y = 80 + (80 * (this.value - this.min) / (this.max - this.min)) * Math.sin(this.rotation * Math.PI / 180);
            this.r = Math.pow(Math.pow((this.x - 80), 2) + Math.pow((this.y - 80), 2), 0.5);
            this.ctx.lineTo(this.x, this.y);
            
            this.ctx.stroke();
        }

    }


    PE.CircleAdjust = CircleAdjust;
})();