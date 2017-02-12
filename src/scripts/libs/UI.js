export class UI {
  constructor() {}

  static query(selector) {
    return document.querySelectorAll(selector)
  }

  static register(selector) {
    return ({ event = 'click' }) => {
      const elems = UI.query(selector)

      if (!elems.length) return console.error("No Elements Has Selected!")

      return elems
    }
  }

  register = UI.register
}

export default new UI()
