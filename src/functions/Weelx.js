/**
 * Weelx is just a "state" helper for this extension
 */
export default class Weelx {
  constructor ({
    state = {},
    mutations = {},
    actions = {},
    watch = {}
  }) {
    this.state = Weelx._proxy(state, watch)
    this.mutations = mutations
    this.actions = actions
  }

  commit (mutation, payload) {
    const mutations = Object.keys(this.mutations)

    if (!mutations.length) {
      return console.log('Has no mutation in the store.')
    }

    if (!mutations.includes(mutation)) {
      return console.log(`There is not mutation named ${mutation}.`)
    }

    return this.mutations[mutation](this.state, payload)
  }

  dispatch (action, payload) {
    const actions = Object.keys(this.actions)

    if (!actions.length) {
      return console.log('Has no action in the store.')
    }

    if (!actions.includes(action)) {
      return console.log(`There is not action named ${action}.`)
    }

    return this.actions[action](this, payload)
  }

  static _proxy (state, watch) {
    return new Proxy(state, {
      set (target, key, value) {
        if (value === state[key]) return true

        if (typeof watch[key] === 'function') {
          watch[key](value, state[key])
        }

        target[key] = value

        return true
      }
    })
  }
}
