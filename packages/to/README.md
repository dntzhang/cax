简体中文 | [English](./README.EN.md) 

# to2to [![](https://img.shields.io/npm/v/to2to.svg)](https://www.npmjs.com/package/to2to) 

> 简单轻量的 Javascript 运动引擎

* [Simple DEMO](http://dntzhang.github.io/cax/packages/to/examples/simple/) 
* [Animation DEMO](https://dntzhang.github.io/cax/packages/to/examples/to/) 
* [To + Shape](https://dntzhang.github.io/cax/packages/cax/examples/to-shape/) 
* [Animate DEMO](https://dntzhang.github.io/cax/packages/cax/examples/to-animate/) 
* [Swing DEMO](https://dntzhang.github.io/cax/packages/to/examples/swing/) 

to2to 中文念 '兔兔兔'，作为 cax 内置的运动套件独立出一个package ，因为它本身可以和平台环境运动对象无关。既可运动 dom，也可运动 cax 内置对象，也可运动对象字面量。众所周知，运动需要循环的 tick 去不断执行偏移函数，小程序，小游戏和web各浏览器的 相应的 API 还是有差异，to2to 抹平了这些差异，让你使用同样的api可以在不同环境畅快运动。

## 特性

* 超轻量级的代码体积
* 支持周期运动
* 支持并行与串行运动
* 运动一切（Canvas、DOM、WebGL、SVG、Object..）
* 支持小程序、小游戏以及 Web 浏览器用相同简介的 API 运动

## 一分钟入门 to2to 使用

通过 npm 安装或者 cdn 下载下来在 HTML 引用该脚本:

``` bash
npm i to2to
```

* [https://unpkg.com/to2to@latest/dist/to.min.js](https://unpkg.com/to2to@latest/dist/to.min.js)
* [https://unpkg.com/to2to@latest/dist/to.js](https://unpkg.com/to2to@latest/dist/to.js)

使用:

``` js
import To from 'to2to'

const ele = document.querySelector('#animateEle')

To.get({ rotate: 0, x: 0, y: 0 })
    .to({ rotate: 720, x: 200, y: 200 }, 1600, To.easing.elasticInOut)
    .progress(function () {
        ele.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`
    })
    .start()
```

## 在 cax 中使用　to2to

cax 内置了 to 的能力以连缀的方式写运动效果：

``` js
const easing = cax.To.easing.elasticInOut

cax.To.get(bitmap)
    .to({ y: 340, rotation: 240 }, 2000, easing)
    .begin(() => {
        console.log("Task one has began!")
    })
    .progress(() => {
        console.log("Task one is progressing!")
    })
    .end(() => {
        console.log("Task one has completed!")
    })
    .wait(500)
    .to()
    .rotation(0, 1400, easing)
    .begin(() => {
        console.log("Task two has began!")
    })
    .progress(() => {
        console.log("Task two is progressing!")
    })
    .end(() => {
        console.log("Task two has completed!")
    })
    .start();
```

* `to` 和 `to` 之间的是并行
* `to` 和 `wait` 之前的是串行
* `to` 和 `to` 之间的 与 下一个 `to` 和 `to` 之间的是串行

有点绕，但是很直观，慢慢体会。

如果想要循环播放的话可以使用 `cycle` 方法:

``` js
cax.To.get(bitmap)
    .to()
    .y(340, 2000, cax.easing.elasticInOut)
    .to
    .y(0, 2000, cax.easing.elasticInOut)
    .cycle()
    .start()
```

[运动演示地址](http://dntzhang.github.io/cax/packages/cax/examples/to/)

## 自定义动画

通过 `animate` 方法可以使用自定义的动画: 

``` js
const stage = new cax.Stage(300, 400, 'body')
const bitmap = new cax.Bitmap('./wepay-diy.jpg', function () {
    var eio = To.easing.elasticInOut
    To.get(bitmap).animate('rubber').start()
})

bitmap.x = 150
bitmap.y = 200
bitmap.originX = 40
bitmap.originY = 40
stage.add(bitmap)

cax.setInterval(() => {
    stage.update()
}, 16)
``` 

to2to 内置了少数几个自定义动画

* rubber
* bounceIn
* flipInX
* zoomOut

## 扩展自定义动画

内置的不够用？自己动手丰衣足食:

比如 `customAnimation` 就是通过下面实现的:

``` js
To.extend('customAnimation', [['to', ['scaleX', {
  '0': 0,
  '1': 400,
  '2': To.easing.elasticInOut
}], ['scaleY', {
  '0': 0,
  '1': 400
}]]])  
```

索引为 2 的 easing 可以传可不传，不传代表线性匀速变化。 

使用刚刚定义的自定义动画:

```js
To.get(obj).animate('customAnimation').start()
```

## 谁在使用？

![Tencent Wechat](../../asset/wx.png)  ![Tencent QQ](../../asset/qq.png)

## License

MIT
