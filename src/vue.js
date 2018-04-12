var _ = require('./util')
var extend = _.extend

/**
 * The exposed Vue constructor.
 * vue.js  文件，暴露出 vue 构造函数
 * API  概念
 * API conventions:
 *  公共的API 接口方法 或者 属性都 会 加上 $ 前缀
 *  内部的方法 或者属性 ，都会使用 _ 下划线进行标识。
 *  没有下划线的都被看出 代办理 的用户数据。
 *
 * - public API methods/properties are prefiexed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue (options) {
  this._init(options)
}

/**
 * Mixin global API
 * 将全局的方法绑定到Vue对象上。
 */

extend(Vue, require('./api/global'))

/**
 * Vue and every constructor that extends Vue has an
 * associated options object, which can be accessed during
 * compilation steps as `this.constructor.options`.
 *
 * These can be seen as the default options of every
 * Vue instance.
 *
 * 所有的 constructor 构造函数，
 */

Vue.options = {
  directives  : require('./directives'),
  filters     : require('./filters'),
  partials    : {},
  transitions : {},
  components  : {}
}

/**
 * 简写 Vue.prototype 为 p.方便后面是属性挂载。
 * Build up the prototype
 */

var p = Vue.prototype

/**
 * 在 $data中 的设置器，
 * $data has a setter which does a bunch of
 * teardown/setup work
 */

Object.defineProperty(p, '$data', {
  get: function () {
    return this._data
  },
  set: function (newData) {
    this._setData(newData)
  }
})

/**
 * Mixin internal instance methods
 * 将内部的实例方法，绑定到 Vue 的原型上。
 */

extend(p, require('./instance/init'))
extend(p, require('./instance/events'))
extend(p, require('./instance/scope'))
extend(p, require('./instance/compile'))

/**
 * Mixin public API methods
 */

extend(p, require('./api/data'))
extend(p, require('./api/dom'))
extend(p, require('./api/events'))
extend(p, require('./api/child'))
extend(p, require('./api/lifecycle'))

module.exports = _.Vue = Vue
