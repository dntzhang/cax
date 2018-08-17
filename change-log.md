## Cax 1.2.8

* 支持 stage.movedetectioninterval 设置检测 touchmove 和 mousemove 事件间隔

## Cax 1.2.7

* 解决 tap 事件触发两次的问题

## Cax 1.2.6

* 小程序 stage 支持支持 touchstart touchmove 和 touchend 事件注入
* button 支持背景图
* 支持 obj.stage 属性获取到当前舞台
* 支持 obj.scale 快速读取和设置 scaleX 和 scaleY
* 修复 mouseout 问题，移动端也支持 mouseout 和 mouseover 事件

## Cax 1.2.5

* group.add 方法如果 child 已经 add 过了，会移除以前的。所以 add 已有的 child 会有置顶的效果
* Text 支持 textAlign 属性
* To 运动可以不传时间，默认为 0 
* Cax 对象支持 setTransform 方法一次性设置所有属性
* Cax 对象支持 setMatrix 方法转换为设置对象的 transform 属性
* 修复 Sprite 的配置 imgs 传入图片而非图片字符串导致不渲染的 bug

## Cax 1.2.4

* filter 方法不需要传递第二个参数

## Cax 1.2.3

* 新增 cax.loadImg 和 cax.loadImgs

## Cax 1.2.2

* 修复微信小游戏里设置了鼠标形状导致的 bug 

## Cax 1.2.1

* 移除了滤镜 dead code
* cax 下挂载 Shape

## Cax 1.2.0

* CSS 全滤镜支持

```js
bitmapA.filter('invert(1)', { x: 0, y: 0, width: 80, height: 80 })
bitmapB.filter('brightness(1.3)', { x: 0, y: 0, width: 80, height: 80 })
bitmapC.filter('blur(15px)', { x: 0, y: 0, width: 80, height: 80 })
bitmapD.filter('contrast(1.3)', { x: 0, y: 0, width: 80, height: 80 })
bitmapE.filter('brightness(0.5)', { x: 0, y: 0, width: 80, height: 80 })
bitmapF.filter('contrast(0.3)', { x: 0, y: 0, width: 80, height: 80 })
bitmapG.filter('grayscale(1)', { x: 0, y: 0, width: 80, height: 80 })
bitmapH.filter('sepia(1)', { x: 0, y: 0, width: 80, height: 80 })
bitmapI.filter('threshold(168)', { x: 0, y: 0, width: 80, height: 80 })
bitmapJ.filter('gamma(10)', { x: 0, y: 0, width: 80, height: 80 })
bitmapK.filter({
    type:'colorize',
    color:'#FF0000',
    amount: 0.6
}, { x: 0, y: 0, width: 80, height: 80 })
```

## Cax 1.1.10

* cache 方法支持持续走 cache canvas 渲染,也支持`cacheUpdating`属性设置持续走 cache canvas 渲染：

 ```js
 obj.cacheUpdating = true
 // or
 obj.cache(0, 0, 100, 100, 1, true)
 ```

## Cax 1.1.9

* fix 鼠标形状的问题
* fix group cache 的问题，所以才能制作这个效果:
  * [Composite Operation](http://dntzhang.github.io/cax/packages/cax/examples/composite-operation/)


## Cax 1.1.8

* 新增 shadow ，使用方式如下:

``` js
obj.shadow = {
    color: 'red',
    offsetX : -5,
    offsetY :5,
    blur:10
}
```

## Cax 1.1.7

* 新增了 absClip 和 unAbsClip 裁剪，与 clip 的区别是 absClip 无视对象自身的坐标系

## Cax 1.1.6

* 修了小程序开发者工具临时图片地址不显示的问题，因为开发者工具临时图片地址也是 http 开头
* restore 放在 return 后面的 bug

## Cax 1.1.5

* 修了小游戏的 canvas 的事件没返回 type 导致 touchstart touchend touchmove 不触发的问题
* 支持了鼠标右键事件

## Cax 1.1.4

* cax 下挂载了强大的 Path , 用于绘制 SVG。如:

```js
const path = new cax.Path('M412.032,413.183l-0.96,1.752c0,0,0.889,0.883,3.98,1.086s5.995-0.493,5.995-0.493L410.032,420.183z')
```

## Cax 1.1.3

* 修复了有 cache canvas 并且设置了 transform 时 clearRect 坐标体系的问题
* 新增 blur filter 
* 新增 unfilter 方法
* 增加 cax.tick 和 cax.untick 
* Buttom 文字偏移可设置

## Cax 1.1.2

* 修复了 cache 坐标体系的问题
* 新加了 filter 骨架，目前只支持 invert 反色
* 修复了 clip 导致事件触发坐标不准确的问题，clip 影响了下一次的 clearRect 

## Cax 1.1.1

* 新增 scaleEventPoint 方法对事件发生点的坐标进行校正，通常用于 Web 里 Canvas 被 Style 缩放比例之后事件触发点不准的情况

## Cax 1.1.0

* 重命名 grouping 为 fixed 
* 除了基础元素 ，group 也支持 cache 和 chip

## Cax 1.0.19

* 增加 grouping 属性可以忽略祖先 group 属性的叠加
* 修复小游戏黑屏 bug

## Cax 1.0.18

* 修复 to2to 暂停 播放 停止 的 bug

## Cax 1.0.17

* Text 测量宽度兼容小程序和小游戏
* ArrowPath 完善

## Cax 1.0.16

* 由于小程序 draw 和 getCanvasImageData 诡异的问题，小程序事件触发默认使用 AABB 

## Cax 1.0.15

* Fix 小程序 bitmap 资源进行 cache 的问题

## Cax 1.0.14

* 对小程序 bitmap 资源进行 cache

## Cax 1.0.13

* 完善了 RoundedRect
* 完善了 ArrowPath
* 事件的 event 暴露了 target 访问事件发生的对象，即 event.target 访问

## Cax 1.0.12

* Stage 增加 width 和 height 属性

## Cax 1.0.11

* Fix https://github.com/dntzhang/cax/issues/12

## Cax 1.0.10

* Fix https://github.com/dntzhang/cax/issues/9

## Cax 1.0.9

* to2to 的`begin`、`end`以及`progress`回调暴露运动 object 参数给使用者

## Cax 1.0.8

* 支持 to2to 的自定义动画的用法

```js
To.get(bitmap).animate('rubber').start()
```

## Cax 1.0.7

* 兼容　to2to 的 easing 用法

## Cax 1.0.6

* fix url 直接引用 cax.js 需要 cax.default 才能访问到 cax 模块的问题

## Cax 1.0.5

* 支持离屏 cache Shape 和 Text 对象 
* To 支持 cycle 方法无限循环运动

## Cax 1.0.4

* 支持 Clip 区域的变形 

## Cax 1.0.3

* 补齐了 Graphics 所有的绘制命令
* 增加了 Clip 裁剪能力

## Cax 1.0.2

* 修复了 begin 回调不执行的 bug
* 修复了 不传 easing 报错的 bug
* 增强了 to.js 的运动能力

```js
cax.To.get(bitmap)
    .to({ x: 300, y: 200 }, 1000, cax.easing.elasticInOut)
    .rotation(360, 1000, cax.easing.elasticInOut)
    .begin(() => {
        console.log("began!")
    })
    .progress(() => {
        console.log("progressing!")
    })
    .end(() => {
        console.log("completed!")
    })
    .start();
```

`to` 方法支持传入参数运动多个属性。

## Cax 1.0.1

* 给小程序、小游戏、Web 增加了 to.js 的运动能力

```js
cax.To.get(bitmap)
    .to()
    .y(240, 2000, cax.easing.elasticInOut)
    .rotation(240, 2000, cax.easing.elasticInOut)
    .end(function () {
        console.log(" task one has completed!")
    })
    .wait(500)
    .to()
    .rotation(0, 1400, cax.easing.elasticInOut)
    .end(function () {
        console.log(" task two has completed!")
    })
    .wait(500)
    .to()
    .scaleX(1, 1400, cax.easing.elasticInOut)
    .scaleY(1, 1400, cax.easing.elasticInOut)
    .end(function () {
        console.log(" task three has completed!")
    })
    .start()
```