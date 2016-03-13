
//begin-------------------AlloyPaper.Util---------------------begin

AlloyPaper.Util = Class.extend({
    "statics": {
        "random": function(min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
    }
});

//end-------------------AlloyPaper.Util---------------------end
