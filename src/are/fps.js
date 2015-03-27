
//begin-------------------ARE.FPS---------------------begin

ARE.FPS = __class.extend({
    "statics": {
        "get": function() {
            if (!this.instance) this.instance = new this();
            this.instance._computeFPS();
            return this.instance.value;
        }
    },
    "ctor": function() {
        this.last = new Date();
        this.current = null;
        this.value = 0;
        this.fpsList = [];
        var self = this;
        setInterval(function() {
            var lastIndex = self.fpsList.length - 1;
            self.value = self.fpsList[lastIndex];
            if (lastIndex > 500) {
                self.fpsList.shift();
            }
        }, 500);
    },
    "_computeFPS": function() {
        this.current = new Date();
        this.fpsList.push(parseInt(1e3 / (this.current - this.last)));
        this.last = this.current;
    }
});

//end-------------------ARE.FPS---------------------end
