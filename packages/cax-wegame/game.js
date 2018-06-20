import cax from './js/libs/cax'

import Background from './js/background'
import Player from './js/player'
import EnemyGroup from './js/enemy-group'
import Music from './js/music'

const bg = new Background()
const player = new Player()
const stage = new cax.Stage()
const enemyGroup = new EnemyGroup()
const music = new Music()

stage.add(bg, enemyGroup, player)

stage.add(player.bulletGroup)

let touchX = null
let touchY = null

wx.onTouchStart(function (e) {
  touchX = e.touches[0].clientX
  touchY = e.touches[0].clientY
})

wx.onTouchMove(function (e) {
  touchX = e.touches[0].clientX
  touchY = e.touches[0].clientY
})

function update () {
  stage.update()
  bg.update()

  player.update()
  if (touchX !== null) {
    player.x = touchX
    player.y = touchY
  }
  enemyGroup.update()

  enemyGroup.children.forEach(enemy => {
    player.bulletGroup.children.forEach(bullet => {
      if (bullet.isCollideWith(enemy)) {
        bullet.visible = false
        enemy.explode()
        music.playExplosion()
      }
    })
  })

  requestAnimationFrame(update)
}

update()
