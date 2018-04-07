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
    const render = compile(getOuterHTML(el))
    this._el.innerHTML = ''
    Object.keys(options.data).forEach(key => this._proxy(key))
    if (options.methods) {
      Object.keys(options.methods).forEach(key => {
        this[key] = options.methods[key].bind(this)
      })
    }
    // 对data对象中所有属性都设置 setter/getter 监听器，
    // 或者对里面出现的数组，改写其原型方法，手动触发监听。
    //
    this._ob = observe(options.data)
    // 初始化一个 watchers 数组
    this._watchers = []
    //
    this._watcher = new Watcher(this, render, this._update)
    this._update(this._watcher.value)
  }

  _update (vtree) {
    if (!this._tree) {
      patch(this._el, vtree)
    } else {
      patch(this._tree, vtree)
    }
    this._tree = vtree
  }

  _renderClass (dynamic, cls) {
    dynamic = dynamic
      ? typeof dynamic === 'string'
        ? dynamic
        : Object.keys(dynamic).filter(key => dynamic[key]).join(' ')
      : ''
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
