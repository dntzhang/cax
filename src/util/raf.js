
//begin-------------------ARE.RAF---------------------begin

ARE.RAF = Class.extend({
    "statics": {
        "ctor": function() {
            var requestAnimFrame = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function(callback, element) {
                    window.setTimeout(callback, 1e3 / 60);
                };
            }();
            var requestInterval = function(fn, delay) {
                if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) return window.setInterval(fn, delay);
                var start = new Date().getTime(),
                    handle = new Object();

                function loop() {
                    var current = new Date().getTime(),
                        delta = current - start;
                    if (delta >= delay) {
                        fn.call();
                        start = new Date().getTime();
                    }
                    handle.value = requestAnimFrame(loop);
                }
                handle.value = requestAnimFrame(loop);
                return handle;
            };
            var clearRequestInterval = function(handle) {
                if (handle) {
                    setTimeout(function() {
                        window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) : clearInterval(handle);
                    }, 0);
                }
            };
            this.requestInterval = requestInterval;
            this.clearRequestInterval = clearRequestInterval;
        }
    }
});

//end-------------------ARE.RAF---------------------end
