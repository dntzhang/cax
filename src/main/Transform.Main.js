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
        { name: "ARE.Vector2", url: "are/util" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var ld = new Loader(), stage = new Stage("#ourCanvas", localStorage.webgl == "1"), bmp;
        ld.loadRes([
            { id: "atLogo", src: "../asset/img/atLogo.png" }
        ]);
        ld.complete(function () {
            bmp = new Bitmap(ld.get("atLogo"));
            //（0.5,0.5）==〉The center is the point of rotation
            bmp.originX = 0.5;
            bmp.originY = 0.5;
            bmp.x = 240;
            bmp.y = 240;
            //bind click event, the event monitor can be accurate to pixel
            bmp.on("click", function () {
                //apply a random filter to the bmp
                bmp.filter=[Math.random(), Math.random(), Math.random(), 1];
            })
            //add object to stage
            stage.add(bmp);
           
            var step = 0.01;
            //loop
            stage.onTick(function () {
                bmp.rotation += 0.5;
                if (bmp.scaleX > 1.5||bmp.scaleX < 0.5) {
                    step *= -1;
                }
                bmp.scaleX += step;
                bmp.scaleY += step;
            })
        });


        
    }
})
