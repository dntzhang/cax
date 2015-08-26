
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
        this.lastMeasured=new Date();
        this.fpsList = [];
        this.totalValue = 0;
        this.value = 60;
      
    },
    "_computeFPS": function() {
        this.current = new Date();
        if (this.current - this.last > 0) {
            var fps = Math.ceil(1e3 / (this.current - this.last));
            this.fpsList.push(fps);
           
            this.totalValue += fps;
            this.last = this.current;
         
       
        }
        if (this.current - this.lastMeasured > 1000) {

            this.value =Math.ceil( this.totalValue / this.fpsList.length);
            this.totalValue = 0;
            this.fpsList.length = 0;
            this.lastMeasured = this.current;

        }
    }
});

//end-------------------ARE.FPS---------------------end
