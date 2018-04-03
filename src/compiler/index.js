import { parse } from './html-parser'
import { generate } from './codegen'

//  https://segmentfault.com/q/1010000009976954
//  Object.create(null) 没有继承任何原型方法，
const cache = Object.create(null)

export function compile (html) {
  html = html.trim()
  const hit = cache[html]
  return hit || (cache[html] = generate(parse(html)))
}
