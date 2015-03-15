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
		var ld = new Loader(), pgBmp;
		var stage = new Stage("#ourCanvas", localStorage.webgl == "1");
		ld.loadRes([
            { id: "kmd", src: "../asset/img/kmd.png" },
            { id: "pig", src: "../asset/img/pig.png" },
            { id: "hero", src: "../asset/img/hero-m.png" }]
            );
		ld.complete(function () {		


			var sprite = new Sprite({
				x: 200,
				y: 200,
				framerate: 5,
				imgs: [ld.get("hero"), ld.get("pig")],
				frames: [
                        // x, y, width, height, imageIndex, originX, originY               
                        [64, 64, 64, 64],
                        [128, 64, 64, 64],
                        [192, 64, 64, 64],
                        [256, 64, 64, 64],
                        [320, 64, 64, 64],
                        [384, 64, 64, 64],
                        [448, 64, 64, 64],

						 [0, 192, 64, 64],
						 [64, 192, 64, 64],
                        [128, 192, 64, 64],
                        [192, 192, 64, 64],
                        [256, 192, 64, 64],
                        [320, 192, 64, 64],
                        [384, 192, 64, 64],
                        [448, 192, 64, 64],
						 [448, 192, 64, 64]
				],
				animations: {
					walk: {
						frames: [0, 1, 2, 3, 4, 5, 6],
						next: "run",
						speed: 2,
						loop: false
					},
					happy: {
						frames: [11,12,13,14]
					},
					win: {
						frames: [7, 8, 9, 10]
					}
				},
				currentAnimation: "walk",
				tickAnimationEnd: function () {
					console.log("播完一轮");
				},
				animationEnd : function () {
					alert("播放完成")
				}
			});
			//sp.hover(function () {
			//    this.scaleX = this.scaleY = 1.1;
			//}, function () {
			//    this.scaleX = this.scaleY = 1;
			//})
			stage.add(sprite);
			Dom.get("#pBtn").on("click", function () {
				sprite.play();
			})
			Dom.get("#sBtn").on("click", function () {
				sprite.stop();
			})
			Dom.get("#gapBtn").on("click", function () {
				sprite.gotoAndPlay("happy");
			})
			Dom.get("#pasBtn").on("click", function () {
				sprite.gotoAndStop("walk");
			})
			Dom.get("#gapoBtn").on("click", function () {
				sprite.gotoAndPlay("win",1);
			})
						
		});



	

	}
})
