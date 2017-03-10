import Matrix2D from './base/matrix2d.js'
import DisplayObject from './display/display_object.js'
import Group from './display/group.js'
import Stage from './display/stage.js'
import Graphics from './display/canvas/graphics.js'
import Path from './display/path.js'
import SVGPath from './display/svg/svg_path.js'
import CanvasPath from './display/canvas/canvas_path.js'

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
AlloyRender.SVGPath = SVGPath
AlloyRender.CanvasPath = CanvasPath

window.AlloyRender = AlloyRender
module.exports = AlloyRender