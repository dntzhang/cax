
//begin-------------------ARE.FPS---------------------begin

ARE.FPS = Class.extend({
    "statics": {
        "get": function() {
            if (!this.instance) this.instance = new this();
            this.instance._computeFPS();
            return this.instance;
        }
    },
    "ctor": function() {
        this.last = new Date();
        this.current = null;
        this.value = 0;
        this.totalValue = 0;
        this.fpsList = [];
        this.count = 0;
        var self = this;
        setInterval(function() {
            var lastIndex = self.fpsList.length - 1;
            self.value = self.fpsList[lastIndex];
            if (lastIndex > 500) {
                self.fpsList.shift();
            }
            self.averageFPS = Math.ceil(self.totalValue / self.count);
        }, 500);
    },
    "_computeFPS": function() {
        this.current = new Date();
        if (this.current - this.last > 0) {
            var fps = Math.ceil(1e3 / (this.current - this.last));
            this.fpsList.push(fps);
            this.count++;
            this.totalValue += fps;
            this.last = this.current;
        }
    }
});

//end-------------------ARE.FPS---------------------end
