export function getImageInWx (img, callback) {
  if (img.indexOf('wxfile://') === 0) {
    wx.getImageInfo({
      src: img,
      success: (info) => {
        callback({
          img: img,
          width: info.width,
          height: info.height
        })
      }
    })
  } else {
    wx.downloadFile({
      url: img,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success: (info) => {
              callback({
                img: res.tempFilePath,
                width: info.width,
                height: info.height
              })
            }
          })
        }
      }
    })
  }
}

function getGlobal () {
  if (typeof global !== 'object' || !global || global.Math !== Math || global.Array !== Array) {
    if (typeof self !== 'undefined') {
      return self
    } else if (typeof window !== 'undefined') {
      return window
    } else if (typeof global !== 'undefined') {
      return global
    }
    return (function () {
      return this
    })()
  }
  return global
}

const root = getGlobal()

export default{
  getImageInWx,
  root,
  isWx: typeof wx !== 'undefined'
}
