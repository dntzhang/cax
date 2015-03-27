Alloy Game Engine
=================

一款强大的javascript游戏引擎.

工具
=================
* [vertex generator](https://kmdjs.github.io/arejs-tool-sprite/)
* [text to image](http://kmdjs.github.io/cwb/)
* [particle editor](http://alloyteam.github.io/ParticleEditor/)
* [map editor](http://alloyteam.github.io/MapEditor/)
* [text to texture](http://alloyteam.github.io/AlloyRenderingEngine/example/glTxt.html)
* [combine images](http://kmdjs.github.io/combineimages/)
* [tiled](http://www.mapeditor.org/)
* [image splitter](http://kmdjs.github.io/imagesplitter/)
* [thumbnail generator](http://kmdjs.github.io/thumbnailgenerator/)
* [image zoom](http://kmdjs.github.io/zoom/)


AlloyRenderingEngine
=================
超快的2d渲染引擎，支持webgl和canvas渲染

### Demo
* [bitmap](http://alloyteam.github.io/AlloyRenderingEngine/example/bitmap.html) 
* [transform](http://alloyteam.github.io/AlloyRenderingEngine/example/transform.html) 
* [tween](http://alloyteam.github.io/AlloyGameEngine/example/tween.html) 
* [dom element](http://alloyteam.github.io/AlloyGameEngine/example/domelement.html) 
* [flip](http://alloyteam.github.io/AlloyRenderingEngine/example/flip.html) 
* [filter](http://alloyteam.github.io/AlloyRenderingEngine/example/filter.html) 
* [shape](http://alloyteam.github.io/AlloyRenderingEngine/example/shape.html) 
* [sprite](http://alloyteam.github.io/AlloyRenderingEngine/example/sprite.html) 
* [text](http://alloyteam.github.io/AlloyRenderingEngine/example/txt.html) 
* [particle system](http://alloyteam.github.io/AlloyRenderingEngine/example/particlesystem.html) 
* [box2d](http://alloyteam.github.io/AlloyRenderingEngine/example/box2d.html) 
* [keyboard events](http://alloyteam.github.io/AlloyRenderingEngine/example/keyboardevents.html) 
* [collision](http://alloyteam.github.io/AlloyRenderingEngine/example/collision.html) 
* [loader](http://alloyteam.github.io/AlloyRenderingEngine/example/loader/loader.html) 
* [scalable](http://alloyteam.github.io/AlloyRenderingEngine/example/scalable.html)


### 一分钟快速入门
要实现下面的效果：

![usage](https://raw.githubusercontent.com/AlloyTeam/AlloyGameEngine/master/asset/img/usage2.gif)

可以使用下面的代码:

```javascript
var bmp, stage = new Stage("#ourCanvas");
bmp = new Bitmap("img/atLogo.png");
//（0.5,0.5）==〉The center is the point of rotation
bmp.originX = 0.5;
bmp.originY = 0.5;
//bind click event, the event monitor can be accurate to pixel
bmp.onClick(function () {
    //apply a random filter to the bmp
    bmp.filter=[Math.random(), Math.random(), Math.random(), 1];
});
//add object to stage
stage.add(bmp);

var step = 0.01;
//loop
stage.onTick(function () {
    bmp.rotation += 0.5;
    if (bmp.scaleX > 1.5 || bmp.scaleX < 0.5) {
        step *= -1;
    }
    bmp.scaleX += step;
    bmp.scaleY += step;
});
```

AlloyAnimationEngine
=================
即将到来，敬请期待。

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
