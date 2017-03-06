import * as fn from './functions.js'

export class WeeL {

  constructor(selector, scope) {
    this.elems    = this.p(selector, scope)
    this.selector = selector.toString()
    this.length   = this.elems.length
  }

  p(selector, scope) {
    if (selector.nodeType === 1) return [selector]

    if (fn.type(selector) === 'nodelist') return Array.from(selector)

    return Array.from((!scope ? document : scope).querySelectorAll(selector))
  }

  /**
   * Do some operation with DOM
   * @param  {String}   event  Event type. e.g. 'click' 'hover' ...
   * @param  {Callback} method Event triggers a operation
   * @return {Object}          Class's this
   */
  do(event, method) {
    return this.register(event, method)
  }

  apply(event, method) {}

  /**
   * Set Listeners of NodeList
   * @param  {String} type Listener method type, [add|remove]
   * @return {Function}    Generate a carry function
   */
  listener(type) {
    /**
     * Traversal function of event listener
     * @param  {String}   event    Event type, [click|focus|...]
     * @param  {Callback} method   Listener's Callback function
     * @param  {Boolean}  capture  Capture, true or false
     * @return {this}
     */
    return (event, method, capture) => {
      this.elems.forEach(elem => elem[`${type}EventListener`](event, method, capture))

      return this
    }
  }

  register(event, method, capture = false) {
    return this.listener('add')(event, method, capture)
  }

  forget(event, method, capture = false) {
    return this.listener('remove')(event, method, capture)
  }

  /**
   * Global Proxy Events by Propagating
   * @param  {String} event     Event Type, [click|...]
   * @param  {Array}  callbacks Events's callback list in arguments
   * @return {this}
   */
  delegate(event, ...callbacks) {
    return this.register(event, ev => {
      callbacks.forEach(callback => callback(ev))
    }, false)
  }

  on() {
    this.elems.forEach(elem => !elem.classList.contains('_on') ? elem.classList.add('_on') : 0)

    return this
  }

  off() {
    this.elems.forEach(elem => elem.classList.contains('_on') ? elem.classList.remove('_on') : 0)

    return this
  }

  turn() {
    this.elems.forEach(elem => elem.classList.toggle('_on'))
  }

  /**
   * Inspect Node Whether Has Specified Class Name
   * @param  {Element} node  A element that need to inspect
   * @param  {Array}   clses Some class name as flag
   * @return {Boolean}       Yes or no
   */
  hasClass(...clses) {
    const node = this.elems[0]

    for (var i = 0; i < clses.length; i++)
      if (!node.classList.contains(clses[i])) return false

    return true
  }

  isUI(...clses) {
    return this.hasClass('-js', ...clses)
  }

}

/**
 * Export Module as Function
 * @param  {String} selector Param "selector" of Weel's constructor
 * @return {Object}          Weel's instance
 */
const mod = selector => new WeeL(selector)

mod.type = fn.type
mod.log = fn.log

export default mod
