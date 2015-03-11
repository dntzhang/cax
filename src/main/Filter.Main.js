kmdjs.config({
    name: "AlloyRenderingEngine",
    baseUrl: "../src",
    classes: [
          { name: "ARE.DisplayObject", url: "are/display" },
          { name: "ARE.Bitmap", url: "are/display" },
          { name: "ARE.Sprite", url: "are/display" },
          { name: "ARE.Stage", url: "are/display" },
          { name: "ARE.Shape", url: "are/display" },
          { name: "ARE.Container", url: "are/display" },
          { name: "ARE.Matrix2D", url: "are/util" },
          { name: "ARE.Loader", url: "are/util" },
          { name: "ARE.UID", url: "are/util" },
          { name: "ARE.CanvasRenderer", url: "are/renderer" },
          { name: "ARE.WebGLRenderer", url: "are/renderer" },
          { name: "ARE.GLMatrix", url: "are/util" },
          { name: "ARE.RAF", url: "are/util" },
          { name: "ARE.Keyboard", url: "are/util" },
          { name: "ARE.RectAdjust", url: "are/display" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var ld = new Loader(), bmp;
        var stage = new Stage("#ourCanvas", localStorage.webgl == "1");
        ld.loadRes([
            { id: "atLogo", src: "../asset/img/atLogo.png" }
        ]);
        ld.complete(function () {
            bmp = new Bitmap(ld.get("atLogo"));
            bmp.x = 110;
            bmp.y = 100;
            bmp.setFilter(1, 0.75, 1,1);
            bmp.on("click", function () {
                alert("这可是高效并且精确到像素级别的事件触发");
            })
            stage.add(bmp);
        });
        var redCtrl = new RectAdjust({
            min: 0,
            max: 1,
            value: 0.8,
            fillStyle: "red",
            change: function (value) {

                bmp.setFilter(redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value);
            },
            renderTo: document.getElementById("rCtrl")
        });

        var greenCtrl = new RectAdjust({
            min: 0,
            max: 1,
            value: 0.2,
            fillStyle: "green",
            change: function (value) {
                bmp.setFilter(redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value);
            },
            renderTo: document.getElementById("gCtrl")
        });

        var blueCtrl = new RectAdjust({
            min: 0,
            max: 1,
            value: 0.8,
            fillStyle: "blue",
            change: function (value) {
                bmp.setFilter(redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value);
            },
            renderTo: document.getElementById("bCtrl")
        });

        var alphaCtrl = new RectAdjust({
            min: 0,
            max: 1,
            value: 1,
            fillStyle: "black",
            change: function (value) {
                bmp.setFilter(redCtrl.value, greenCtrl.value, blueCtrl.value, alphaCtrl.value);
            },
            renderTo: document.getElementById("aCtrl")
        });
    }
})
