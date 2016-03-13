AlloyGameEngine
=================

让游戏制作变得超级容易

###AlloyPaper

超快的2d渲染引擎，支持webgl和canvas渲染

##### 基础例子

* [bitmap](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/bitmap.html) 
* [transform](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/transform.html) 
* [event](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/event.html) 
* [tween](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/tween.html) 
* [clip](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/clip.html) 
* [filter](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/filter.html) 
* [shape](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/shape.html) 
* [sprite](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/sprite.html) 
* [text](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/text.html) 
* [particle system](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/particlesystem.html) 
* [box2d](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/box2d.html) 
* [keyboard event](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/keyboardevents.html) 
* [collision](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/collision.html) 
* [scalable](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/scalable.html)
* [cursor](http://alloyteam.github.io/AlloyGameEngine/AlloyPaper/example/cursor.html)

##### 一分钟快速入门
要实现下面的效果：

![usage](https://raw.githubusercontent.com/AlloyTeam/AlloyGameEngine/master/AlloyPaper/example/asset/img/usage2.gif)

可以使用下面的代码:

```javascript
var stage = new Stage("#ourCanvas"),
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

###教程

* [AlloyPaper入门](http://www.alloyteam.com/2015/04/6726/)
* [AlloyPaper之Shape](http://www.alloyteam.com/2015/04/alloyrenderingengine-zhi-shape/)
* [AlloyPaper继承](http://www.alloyteam.com/2015/04/alloyrenderingengine-ji-cheng/)
* [AlloyPaper文本框组件](http://www.alloyteam.com/2015/05/alloyrenderingengine-wen-ben-kuang-zu-jian/)
* [AlloyPaper燃烧的进度条](http://www.alloyteam.com/2015/05/alloyrenderingengine-ran-shao-di-jin-du-tiao/)

###工具推荐

* [particle editor](http://alloyteam.github.io/AlloyGameEngine/ParticleEditor/)
* [combine images](http://kmdjs.github.io/combineimages/)
* [image splitter](http://kmdjs.github.io/imagesplitter/)
* [thumbnail generator](http://kmdjs.github.io/thumbnailgenerator/)
* [image zoom](http://kmdjs.github.io/zoom/)
* [texture packer](https://www.codeandweb.com/texturepacker)
* [tiled](http://www.mapeditor.org/)

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
