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