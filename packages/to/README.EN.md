English | [简体中文](./README.md) 

# to2to [![](https://img.shields.io/npm/v/to2to.svg)](https://www.npmjs.com/package/to2to) 

> Simple and lightweight javascript animation engine

* [Simple DEMO](http://dntzhang.github.io/cax/packages/to/examples/simple/) 
* [Animation DEMO](https://dntzhang.github.io/cax/packages/to/examples/to/) 
* [Clip Transform Animation DEMO](https://dntzhang.github.io/cax/packages/cax/examples/clip-transform-to/) 

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

* `to` and `to` are parallel
* `to` and `wait` are parallel before
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


# Who is using cax?

![](./asset/wx.png)  ![](./asset/qq.png)

## License

MIT
