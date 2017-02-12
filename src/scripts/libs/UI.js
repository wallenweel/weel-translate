import { functions } from './storage.js'

export class UI {
  constructor() {}

  elems = []

  q(selector) {
    this.elems = document.querySelectorAll(selector)

    if (!this.elems.length) return console.error("No Elements Has Selected!")

    return this
  }

  register(name) {
    return (type, listener = functions[name], capture = false) => {
      this.elems.forEach(elem => elem.addEventListener(type, listener, capture))

      return this
    }
  }

  unregister(name) {
    return (type, capture = false) => {
      this.elems.forEach(elem => elem.removeEventListener(type, functions[name], capture))

      return this
    }
  }

  on() {
    this.elems.forEach(elem => {
      if (!elem.classList.contains('_on')) elem.classList.add('_on')
    })
  }

  off() {
    this.elems.forEach(elem => {
      if (elem.classList.contains('_on')) elem.classList.remove('_on')
    })
  }

  toggle() {
    this.elems.forEach(elem => elem.classList.toggle('_on'))
  }

}

export default new UI()
