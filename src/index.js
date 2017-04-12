import Matrix2D from './base/matrix2d.js'
import DisplayObject from './display/display_object.js'
import Group from './display/group.js'
import Stage from './display/stage.js'
import Graphics from './display/graphics.js'
import Path from './display/path.js'
import Circle from './display/circle.js'
import Sprite from './display/sprite.js'

let AlloyRender = { }

AlloyRender.Matrix2D = Matrix2D
AlloyRender.Stage = Stage
AlloyRender.DisplayObject = DisplayObject
AlloyRender.Group = Group
AlloyRender.Graphics = Graphics
AlloyRender.Path = Path
AlloyRender.Circle = Circle
AlloyRender.Sprite = Sprite

window.AlloyRender = AlloyRender
module.exports = AlloyRender