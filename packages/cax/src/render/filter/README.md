规则:
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
http://www.runoob.com/cssref/css3-pr-filter.html

https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function

再加上:
horizontalFlip 和 verticalFlip 来制作镜像 spritesheet
new cax.Sprite({
    imgs:[bitmap.flipX()]
})
//bitmap.flipX(), flipX return的就是 this.cacheCanvas
//bitmap.filpY()



