export class weel {
  constructor(selector = '') {
    this.selector = selector
    this.objects = this.p(this.selector)
    this.length = this.objects.length
  }


  p(selector) {
    return document.querySelectorAll(selector)
  }

  /**
   * Do some operation with DOM
   * @param  {String}   event  Event type. e.g. 'click' 'hover' ...
   * @param  {Callback} method Event triggers a operation
   * @return {Object}          Class's this
   */
  do(event, method) {
    this.register(event, method)

    return this
  }

  apply(event, method) {}

  listener(type) {
    return (event, method, capture) => {
      this.objects.forEach(obj => {
        obj[`${type}EventListener`](event, method, capture)
      })
    }
  }

  register(event, method, capture = false) {
    this.listener('add')(event, method, capture)

    return this
  }

  forget(event, method, capture = false) {
    this.listener('remove')(event, method, capture)

    return this
  }

  delegate(event, ...callbacks) {
    this.register(event, ev => {
      callbacks.forEach(callback => callback(ev))
    }, false)
  }

  type(obj, val = '') {
    const r = /(\w+)\]$/.exec(Object.prototype.toString.apply(obj).toLowerCase())[1]

    if (!val) return r

    return (val === r)
  }
}

export default selector => new weel(selector)
