import cax from './index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    option: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: 0,
    height: 0,
    id: 'caxCanvas' + cax.caxCanvasId++,
    index: cax.caxCanvasId - 1
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getCaxCanvasId: function () {
      return this.data.id
    },

    touchStart: function (evt) {
      this.stage.touchStartHandler(evt)
    },

    touchMove: function (evt) {
      this.stage.touchMoveHandler(evt)
    },

    touchEnd: function (evt) {
      this.stage.touchEndHandler(evt)
    }

  }
})
