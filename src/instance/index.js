import { compile } from '../compiler/index'
import { observe } from '../observer/index'
import Watcher from '../observer/watcher'
import { h, patch } from '../vdom/index'
import { nextTick, isReserved, getOuterHTML } from '../util/index'

export default class Component {
  constructor (options) {
    this.$options = options
    this._data = options.data
    const el = this._el = document.querySelector(options.el)
    // 真实dom转化为ast , 解析指令 ，返回 函数中 包裹 __h__的虚拟dom.
    const render = compile(getOuterHTML(el))
    this._el.innerHTML = ''

    // 代理 this._data 上的所有属性 到 this 上
    // this.xxx === this._data.xxx;
    Object.keys(options.data).forEach(key => this._proxy(key))

    //vue 实例中对应 methods ，存放各种函数方法，
    //利用bind 创建一个新函数，改变里面的this到当前的vue 实例上。
    if (options.methods) {
      Object.keys(options.methods).forEach(key => {
        this[key] = options.methods[key].bind(this)
      })
    }
    // 对data对象中所有属性都设置 setter/getter 监听器，
    // 或者对里面出现的数组，改写其原型方法，手动触发监听。
    this._ob = observe(options.data)
    // 初始化一个 watchers 数组
    this._watchers = []
    // 利用暴露出来的watch ,监听 虚拟dom 中的变化，触发回调 this._update。
    this._watcher = new Watcher(this, render, this._update)
    // this._watcher.value； 保存着 执行完 render 函数后的 虚拟dom 树。
    this._update(this._watcher.value)
  }

  _update (vtree) {
    if (!this._tree) {
      // 初始化 渲染时, 还没有 虚拟DOM 树。
      patch(this._el, vtree)
    } else {
      patch(this._tree, vtree)
    }
    this._tree = vtree
  }

  _renderClass (dynamic, cls) {
    dynamic = dynamic
      ? typeof dynamic === 'string'
        ? dynamic // 只渲染 class 的属性值，对应为true 的class
        : Object.keys(dynamic).filter(key => dynamic[key]).join(' ')
      : ''
      // 将动态绑定的class  和 固定存在的 class拼接到一起。
    return cls
      ? cls + (dynamic ? ' ' + dynamic : '')
      : dynamic
  }

  __flatten__ (arr) {
    var res = []
    for (var i = 0, l = arr.length; i < l; i++) {
      var e = arr[i]
      if (Array.isArray(e)) {
        for (var j = 0, k = e.length; j < k; j++) {
          if (e[j]) {
            res.push(e[j])
          }
        }
      } else if (e) {
        res.push(e)
      }
    }
    return res
  }

  _proxy (key) {
    if (!isReserved(key)) {
      // need to store ref to self here
      // because these getter/setters might
      // be called by child scopes via
      // prototype inheritance.
      // 利用 self 存储 this 引用，可能会在 子作用域内被调用。
      var self = this
      Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return self._data[key]
        },
        set: function proxySetter (val) {
          self._data[key] = val
        }
      })
    }
  }
}

Component.prototype.__h__ = h
Component.nextTick = nextTick
