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
          { name: "ARE.Keyboard", url: "are/util" },
          { name: "ARE.Transform", url: "are/util" },
             { name: "ARE.Observable", url: "are/util" },
                { name: "ARE.Matrix3D", url: "are/util" },
                  { name: "ARE.DomElement", url: "are/display" },
             { name: "ARE.RAF", url: "are/util" },
                { name: "ARE.FPS", url: "are/util" }

    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var stage = new Stage("#ourCanvas", localStorage.webgl == "1");

        var domElement = new DomElement("#testDom");
  
        domElement.y = 180;
        domElement.rotateX = -20;

        stage.add(domElement);


        stage.onTick(function () {
            domElement.rotateY+=1;
        })
    }
})
