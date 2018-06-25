English | [简体中文](./README.md) 

# to2to [![](https://img.shields.io/npm/v/to2to.svg)](https://www.npmjs.com/package/to2to) 

> Simple and lightweight javascript animation engine

* [Simple DEMO](http://dntzhang.github.io/cax/packages/to/examples/simple/) 
* [Animation DEMO](https://dntzhang.github.io/cax/packages/to/examples/to/) 
* [Clip Transform Animation DEMO](https://dntzhang.github.io/cax/packages/cax/examples/clip-transform-to/) 
* [Animate DEMO](https://dntzhang.github.io/cax/packages/cax/examples/to-animate/) 
* [Swing DEMO](https://dntzhang.github.io/cax/packages/to/examples/swing/) 

## Features

* Simple API and lightweight 
* Support cycle movement
* Support parallel and serial motion
* Can be used in all environments (Canvas, DOM, WebGL, SVG, Object..)
* Support weapp, wegame and browsers with the same simple API

## Getting Started

Get to2to through npm or cdn:

``` bash
npm i to2to
```

* [https://unpkg.com/to2to@latest/dist/to.min.js](https://unpkg.com/to2to@latest/dist/to.min.js)
* [https://unpkg.com/to2to@latest/dist/to.js](https://unpkg.com/to2to@latest/dist/to.js)

Usage:

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

## Using to2to in cax

Cax has built-in to capability to write motion effects in a continuous way.

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

* `to` and `to` are parallel
* `to` and `wait` are serial 
* The serial between `to` and `to` is serial with the next `to` and `to`

Of course, `set` can also be used to support the movement of arbitrary attributes, such as:

``` js
.set('y', 240, 2000, cax.easing.elasticInOut)
``` 

Equate to:

``` js
.y(240, 2000, cax.easing.elasticInOut)
```

If you want circular motion, you can use the `cycle` method:

``` js
cax.To.get(bitmap)
    .to()
    .y(340, 2000, cax.easing.elasticInOut)
    .to
    .y(0, 2000, cax.easing.elasticInOut)
    .cycle()
    .start()
```

[Motion Demo](http://dntzhang.github.io/cax/packages/cax/examples/to/)


## Custom animation

You can use custom animation through the `animate` method:

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

to2to has a few custom animations built in:

* rubber
* bounceIn
* flipInX
* zoomOut

## Extend custom animation

Built in is not enough to use? do-it-yourselfery!

For example, `customAnimation` is implemented through the following:

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

An index of 2 easing can be transmitted or transmitted without representing a linear uniform change.

Using the defined custom animation:

```js
To.get(obj).animate('customAnimation').start()
```

# Who is using cax?

![Tencent Wechat](./asset/wx.png)  ![Tencent QQ](./asset/qq.png)

## License

MIT
