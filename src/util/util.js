
//begin-------------------are.Util---------------------begin

are.Util = Class.extend({
    "statics": {
        "random": function(min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    }
});

//end-------------------are.Util---------------------end
