import Matrix2D from './base/matrix2d.js'
import DisplayObject from './display/display_object.js'
import Group from './display/group.js'
import Stage from './display/stage.js'
import Graphics from './display/graphics.js'
import Path from './display/path.js'

let AlloyRender = { }


AlloyRender.RenderMode = { }

AlloyRender.RenderMode.Canvas = 'Canvas'

AlloyRender.RenderMode.SVG = 'SVG'

AlloyRender.Matrix2D = Matrix2D
AlloyRender.Stage = Stage
AlloyRender.DisplayObject = DisplayObject
AlloyRender.Group = Group
AlloyRender.Graphics = Graphics
AlloyRender.Path = Path

window.AlloyRender = AlloyRender
module.exports = AlloyRender