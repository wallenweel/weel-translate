import * as fn from './functions.js'

export class UI {
  constructor() {}

  elems = []

  q(selector) {
    this.elems = document.querySelectorAll(selector)

    if (!this.elems.length) return console.error("No Elements Has Selected!")

    return this
  }

  register(name) {
    return (type, listener, capture = false) => {
      const _capture = typeof listener === 'boolean' ? listener : capture
      const _listener = fn[name] || listener
      this.elems.forEach(elem => elem.addEventListener(type, _listener, _capture))

      return this
    }
  }

  unregister(name) {
    return (type, capture = false) => {
      this.elems.forEach(elem => elem.removeEventListener(type, fn[name], capture))

      return this
    }
  }

  on() {
    this.elems.forEach(elem => {
      if (!elem.classList.contains('_on')) elem.classList.add('_on')
    })
  }

  off(callback) {
    this.elems.forEach(elem => {
      if (elem.classList.contains('_on')) elem.classList.remove('_on')
    })
    if (callback) callback(this.elems)
  }

  toggle() {
    this.elems.forEach(elem => elem.classList.toggle('_on'))
  }

}

export default new UI()
