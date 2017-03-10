import AlloyRender from './alloy_render.js'
import Matrix2D from './matrix2d.js'
import DisplayObject from './display_object.js'
import Group from './group.js'
import Stage from './stage.js'
import Graphics from './graphics.js'

AlloyRender.Matrix2D = Matrix2D
AlloyRender.Stage = Stage
AlloyRender.DisplayObject = DisplayObject
AlloyRender.Group = Group
AlloyRender.Graphics = Graphics

window.AlloyRender = AlloyRender
module.exports = AlloyRender