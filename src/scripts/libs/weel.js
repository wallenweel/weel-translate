import * as fn from './functions.js'

export default class WeeL {

  constructor(selector, scope) {
    this.elems    = this.p(selector, scope)
    this.elem     = this.elems[0]
    this.selector = selector.toString()
    this.length   = this.elems.length
  }

  p(selector, scope) {
    if (selector.nodeType === 1) return [selector]

    if (fn.type(selector) === 'nodelist') return [...selector]

    return [...(!scope ? document : scope).querySelectorAll(selector)]
  }

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
    }, true)
  }

  on() {
    this.elems.forEach(elem => !elem.classList.contains('_on') ? elem.classList.add('_on') : 0)

    return this
  }

  isOn() {
    return this.hasClass('_on')
  }

  off() {
    this.elems.forEach(elem => elem.classList.contains('_on') ? elem.classList.remove('_on') : 0)

    return this
  }

  isOff() {
    return !this.hasClass('_on')
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
    const target = this.elem

    for (var i = 0; i < clses.length; i++)
      if (!target.classList.contains(clses[i])) return false

    return true
  }

  isUI(...clses) {
    return this.hasClass('-js', ...clses)
  }

  rmData(name, value) {
    const target = this.elem
    const origin = target.getAttribute(name)

    target.setAttribute(name, origin.replace(value, ''))
  }

}

/**
 * Export Module as Function
 * @param  {String} selector Param "selector" of Weel's constructor
 * @return {Object}          Weel's instance
 */
export const weel = selector => new WeeL(selector)

weel.type = fn.type
weel.log = fn.log
