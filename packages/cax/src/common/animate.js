import TWEEN from '../common/tween'

export function fadeIn (obj) {
  obj.alpha = 0
  new TWEEN.Tween(obj).to({ alpha: 1 }, 600).start()
}

export function fadeOut (obj) {
  obj.alpha = 1
  new TWEEN.Tween(obj).to({ alpha: 0 }, 600).start()
}

export function fadeOutAndDestroy (obj) {
  obj.alpha = 1
  new TWEEN.Tween(obj).to({ alpha: 0 }, 600).onComplete(() => {
    obj.destroy()
  }).start()
}

export function bounceIn (obj, from, to) {
  from = from || 0
  obj.from = from
  new TWEEN.Tween(obj).to({ scaleX: to || 1, scaleY: to || 1 }, 300)
    .easing(TWEEN.Easing.Bounce.Out).start()
}

export function bounceOut (obj, from, to) {
  from = from || 1
  obj.from = from
  new TWEEN.Tween(obj).to({ scaleX: to || 0, scaleY: to || 0 }, 300)
    .easing(TWEEN.Easing.Bounce.Out).start()
}
