kmdjs.config({
    name: "AlloyRenderingEngine",
    baseUrl: "../src",
    classes: [
        { name: "ARE.Bitmap", url: "are/display/bitmap.js" },
        { name: "ARE.CircleShape", url: "are/display/circle-shape.js" },
        { name: "ARE.Container", url: "are/display/container.js" },
        { name: "ARE.DisplayObject", url: "are/display/display-object.js" },
        { name: "ARE.DomElement", url: "are/display/dom-element.js" },
        { name: "ARE.Particle", url: "are/display/particle.js" },
        { name: "ARE.ParticleSystem", url: "are/display/particle-system.js" },
        { name: "ARE.RectAdjust", url: "are/display/rect-adjust.js" },
        { name: "ARE.RectShape", url: "are/display/rect-shape.js" },
        { name: "ARE.Shape", url: "are/display/shape.js" },
        { name: "ARE.Sprite", url: "are/display/sprite.js" },
        { name: "ARE.Stage", url: "are/display/stage.js" },
        { name: "ARE.Text", url: "are/display/text.js" },
        { name: "ARE.CanvasRenderer", url: "are/renderer/canvas-renderer.js" },
        { name: "ARE.WebGLRenderer", url: "are/renderer/webgl-renderer.js" },
        { name: "ARE.Dom", url: "are/util/dom.js" },
        { name: "ARE.FPS", url: "are/util/fps.js" },
        { name: "ARE.GLMatrix", url: "are/util/glmatrix.js" },
        { name: "ARE.Keyboard", url: "are/util/keyboard.js" },
        { name: "ARE.Loader", url: "are/util/loader.js" },
        { name: "ARE.Matrix2D", url: "are/util/matrix2d.js" },
        { name: "ARE.To", url: "are/util/to.js" },
        { name: "ARE.Observable", url: "are/util/observable.js" },
        { name: "ARE.RAF", url: "are/util/raf.js" },
        { name: "ARE.TWEEN", url: "are/util/tween.js" },
        { name: "ARE.UID", url: "are/util/uid.js" },
        { name: "ARE.Util", url: "are/util/util.js" },
        { name: "ARE.Vector2", url: "are/util/vector2.js" },
        { name: "AlloyRenderingEngine.Tank" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {

        var ld = new Loader(), stage = new Stage("#ourCanvas", localStorage.webgl == "1");
        ld.loadRes([
            { id: "tanks", src: "../asset/img/tanks.png" }
        ]);
        ld.complete(function () {
            var tank = new Tank({
                img: ld.get("tanks")
            });

            stage.add(tank);

            stage.onTick(function () {
                checkActive() && tank.stop();
            })

            stage.onKeyboard("left", function () {  
                tank.direction = "left";
            }, function () {
               
                tank.direction = getActive();
            })
            stage.onKeyboard("right", function () {
                tank.direction = "right";
            }, function () {
                tank.direction = getActive();
            })
            stage.onKeyboard("down", function () {
                tank.direction = "down";
            }, function () {
                tank.direction = getActive();
            })
            stage.onKeyboard("up", function () {
                tank.direction = "up";
            }, function () {
                tank.direction = getActive();
            })
            stage.onKeyboard("left+up", function () {
                tank.direction = "left_up";
            }, function () {
                tank.direction = getActive();
            })
            stage.onKeyboard("right+up", function () {
                tank.direction = "up_right";
            }, function () {
                tank.direction = getActive();
            })
            stage.onKeyboard("right+down", function () {
                tank.direction = "right_down";
            }, function () {
                tank.direction = getActive();
            })
            stage.onKeyboard("left+down", function () {
                tank.direction = "down_left";
            }, function () {
                tank.direction = getActive();
            })
           
            function checkActive() {
                return stage.getActiveKeys().indexOf("left") == -1
                   && stage.getActiveKeys().indexOf("up") == -1
                   && stage.getActiveKeys().indexOf("down") == -1
                   && stage.getActiveKeys().indexOf("right") == -1;
            }
            function getActive() {
                if( stage.getActiveKeys().indexOf("left")!== -1) return "left";
                if (stage.getActiveKeys().indexOf("right") !== -1) return "right";
                if (stage.getActiveKeys().indexOf("up") !== -1) return "up";
                if (stage.getActiveKeys().indexOf("down") !== -1) return "down";
            }
           
        });   
   

    }
})
