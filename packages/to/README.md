简体中文 | [English](./README.EN.md) 

# to-to [![](https://img.shields.io/npm/v/cax.svg)](https://www.npmjs.com/package/cax) 

> 简单轻量的 Javascript 运动引擎

* [Simple DEMO](http://dntzhang.github.io/cax/packages/to/examples/simple/) 
* [Animation DEMO](https://dntzhang.github.io/cax/packages/to/examples/to/) 
* [Clip DEMO](https://dntzhang.github.io/cax/packages/cax/examples/clip/) 
* [Clip Transform Animation DEMO](https://dntzhang.github.io/cax/packages/cax/examples/clip-transform-to/) 

## 特性

* 超轻量级的代码体积
* 支持周期运动
* 支持并行与串行运动
* 运动一切（Canvas、DOM、WebGL、SVG、Object..）
* 支持小程序、小游戏以及 Web 浏览器用相同简介的 API 运动

## 一分钟入门 to-to 使用

Get to-to through npm or cdn:

``` bash
npm i to-to
```

* [https://unpkg.com/to-to@latest/dist/to.min.js](https://unpkg.com/to-to@latest/dist/to.min.js)
* [https://unpkg.com/to-to@latest/dist/to.js](https://unpkg.com/to-to@latest/dist/to.js)

Usage:

``` js
import To from 'to-to'

const ele = document.querySelector('#animateEle')

To.get({ rotate: 0, x: 0, y: 0 })
    .to({ rotate: 720, x: 200, y: 200 }, 1600, To.easing.elasticInOut)
    .progress(function () {
        ele.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`
    })
    .start()
```

## 在 cax 中使用　to

cax 内置了 to 的能力以连缀的方式写运动效果：

``` js
cax.To.get(bitmap)
    .to()
    .y(340, 2000, cax.easing.elasticInOut)
    .rotation(240, 2000, cax.easing.elasticInOut)
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
    .rotation(0, 1400, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task two has began!")
    })
    .progress(() => {
        console.log("Task two is progressing!")
    })
    .end(() => {
        console.log("Task two has completed!")
    })
    .wait(500)
    .to()
    .scaleX(1, 1400, cax.easing.elasticInOut)
    .scaleY(1, 1400, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task three has began!")
    })
    .progress(() => {
        console.log("Task three is progressing!")
    })
    .end(() => {
        console.log("Task three has completed!")
    })
    .wait(500)
    .to({ x: 300, y: 200 }, 1000, cax.easing.elasticInOut)
    .rotation(360, 1000, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task four has began!")
    })
    .progress(() => {
        console.log("Task four is progressing!")
    })
    .end(() => {
        console.log("Task four has completed!")
    })
    .start();
```

* `to` 和 `to` 之间的是并行
* `to` 和 `wait` 之前的是并行
* `to` 和 `to` 之间的 与 下一个 `to` 和 `to` 之间的是串行

有点绕，但是很直观，慢慢体会。

当然，也可以通过 set 方法支持任意属性的运动，如:

``` js
.set('y', 240, 2000, cax.easing.elasticInOut)
``` 

等同于

``` js
.y(240, 2000, cax.easing.elasticInOut)
```

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


## 谁在使用？

![](./asset/wx.png)  ![](./asset/qq.png)

## License

MIT
