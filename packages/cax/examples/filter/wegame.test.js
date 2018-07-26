import cax from './js/libs/cax'


const stage = new cax.Stage()

const bitmap = new cax.Bitmap('images/wepay-diy.jpg')
bitmap.x = 20
bitmap.y = 30
stage.add(bitmap)


const bitmapA = bitmap.clone()
bitmapA.x = 20
bitmapA.y = 110
stage.add(bitmapA)

const bitmapB = bitmapA.clone()
bitmapB.x = 110
stage.add(bitmapB)

const bitmapC = bitmapA.clone()
bitmapC.x = 200
stage.add(bitmapC)

const bitmapD = bitmapA.clone()
bitmapD.x = 200
bitmapD.y = 30
stage.add(bitmapD)

const bitmapE = bitmapA.clone()
bitmapE.x = 110
bitmapE.y = 30
stage.add(bitmapE)

const bitmapF = bitmapA.clone()
bitmapF.x = 200
bitmapF.y = 190
stage.add(bitmapF)

const bitmapG = bitmapA.clone()
bitmapG.x = 20
bitmapG.y = 190
stage.add(bitmapG)

const bitmapH = bitmapA.clone()
bitmapH.x = 110
bitmapH.y = 190
stage.add(bitmapH)

const bitmapI = bitmapA.clone()
bitmapI.x = 110
bitmapI.y = 270
stage.add(bitmapI)

const bitmapJ = bitmapA.clone()
bitmapJ.x = 20
bitmapJ.y = 270
stage.add(bitmapJ)

const bitmapK = bitmapA.clone()
bitmapK.x = 200
bitmapK.y = 270
stage.add(bitmapK)


filter()



function unfilter(){
    bitmapA.unfilter()
    bitmapB.unfilter() 
    bitmapC.unfilter()
    bitmapD.unfilter()
    bitmapE.unfilter()
    bitmapF.unfilter()
    bitmapG.unfilter()
    bitmapH.unfilter()
    bitmapI.unfilter()
    bitmapJ.unfilter()
    bitmapK.unfilter()
}

function filter(){
    bitmapA.filter('invert(1)', { x: 0, y: 0, width: 80, height: 80 })
    bitmapB.filter('brightness(1.1)', { x: 0, y: 0, width: 80, height: 80 })
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
}

cax.tick(() => {
    stage.update()
})

setTimeout(function(){
  unfilter()
},2000)

setTimeout(function(){
  filter()
},4000)