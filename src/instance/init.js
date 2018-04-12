var mergeOptions = require('../util/merge-option')

/**
 * The main init sequence. This is called for every
 * instance, including ones that are created from extended
 * constructors.
 *
 * 这里的 options
 * @param {Object} options - this options object should be
 *                           the result of merging class
 *                           options and the options passed
 *                           in to the constructor.
 */

exports._init = function (options) {

  options = options || {}

  this.$el           = null
  this.$parent       = options._parent
  this.$root         = options._root || this
  this.$             = {} // child vm references
  this.$$            = {} // element references
  this._watcherList  = [] // all watchers as an array
  this._watchers     = {} // internal watchers as a hash
  this._userWatchers = {} // user watchers as a hash
  this._directives   = [] // all directives

  // a flag to avoid this being observed
  //  避免 vue 框架内部使用的 变量 被监听。
  this._isVue = true

  // events bookkeeping
  //  用来规定 事件回调
  this._events         = {}    // registered callbacks
  this._eventsCount    = {}    // for $broadcast optimization
  this._eventCancelled = false // for event cancellation

  // block instance properties
  this._isBlock     = false
  this._blockStart  =          // @type {CommentNode}
  this._blockEnd    = null     // @type {CommentNode}

  // lifecycle state
  // 生命周期函数的 状态。
  // 默认都为 false,表示没有完成。
  this._isCompiled  =
  this._isDestroyed =
  this._isReady     =
  this._isAttached  =
  this._isBeingDestroyed = false

  // children
  // 为后面使用 children 设置为null 空
  this._children =         // @type {Array}
  this._childCtors = null  // @type {Object} - hash to cache
                           // child constructors

  // merge options.传入的 options 和 构造函数内部的 options参数。
  options = this.$options = mergeOptions(
    this.constructor.options,
    options,
    this
  )

  // set data after merge.
  // 获取到 options 中的data字段，
  // 保存在 this._data 中。
  this._data = options.data || {}

  // initialize data observation and scope inheritance.
  this._initScope()

  // setup event system and option events.
  this._initEvents()

  // call created hook
  this._callHook('created')

  // if `el` option is passed, start compilation.
  if (options.el) {
    // 将即将传入的 根节点的选择器 传入到 $mount() 函数中，
    // 进行编译。
    this.$mount(options.el)
  }
}
