kmdjs.config({
    name: "AlloyRenderingEngine",
    baseUrl: "../src",
    classes: [
        { name: "ARE.Bitmap", url: "are/display" },
        { name: "ARE.CircleShape", url: "are/display" },
        { name: "ARE.Container", url: "are/display" },
        { name: "ARE.DisplayObject", url: "are/display" },
        { name: "ARE.DomElement", url: "are/display" },
        { name: "ARE.Particle", url: "are/display" },
        { name: "ARE.ParticleSystem", url: "are/display" },
        { name: "ARE.RectAdjust", url: "are/display" },
        { name: "ARE.RectShape", url: "are/display" },
        { name: "ARE.Shape", url: "are/display" },
        { name: "ARE.Sprite", url: "are/display" },
        { name: "ARE.Stage", url: "are/display" },
        { name: "ARE.Txt", url: "are/display" },
        { name: "ARE.CanvasRenderer", url: "are/renderer" },
        { name: "ARE.WebGLRenderer", url: "are/renderer" },
        { name: "ARE.Dom", url: "are/util" },
        { name: "ARE.FPS", url: "are/util" },
        { name: "ARE.GLMatrix", url: "are/util" },
        { name: "ARE.Keyboard", url: "are/util" },
        { name: "ARE.Loader", url: "are/util" },
        { name: "ARE.Matrix2D", url: "are/util" },
        { name: "ARE.Matrix3D", url: "are/util" },
        { name: "ARE.Observable", url: "are/util" },
        { name: "ARE.RAF", url: "are/util" },
        { name: "ARE.Transform", url: "are/util" },
        { name: "ARE.TWEEN", url: "are/util" },
        { name: "ARE.UID", url: "are/util" },
        { name: "ARE.Util", url: "are/util" },
        { name: "ARE.Vector2", url: "are/util" },
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
