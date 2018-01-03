import { env } from '@/globals'

/**
 * Two envrionments helper
 * @param {Callback} right run in right environment
 * @param {Callback} substitute other stutas
 * @returns
 */
export const aid = (right, substitute = () => null) => {
  try {
    return right()
  } catch (error) {
    return substitute()
  }
}

/**
 * custom log method
 * @param {Any} args any number arguments that `console.log` accepted
 */
export const clog = (...args) => {
  if (!env.log) return false

  console.log(
    `[WeeL Translate] `,
    ...args
  )
}

/**
 * quickly and simply to clone a object, mainly for avoiding vuex
 * getter/setter watch state occur reference issues
 * @param {Any} target any thing that "JSON" can parse
 * @return {Any} cloned target
 */
export const jpjs = (target) => JSON.parse(JSON.stringify(target))

/**
 * a fake hash that base to time, just a random string
 * @return {String}
 */
export const timehash = () => {
  const hash = `${new Date().getTime()}`.split('')
    .map(v => v.charCodeAt(0))
    .reduce((a, v) => a + ((a << 7) + (a << 3)) ^ v)
    .toString(16)

  return hash.replace(/^-/, '')
}

/**
 * What is its type
 * @param {Any} thing something is need to get type
 * @return {String} type name in lower case, e.g. object ...
 */
export const whattype = thing =>
  Object.prototype.toString.call(thing)
  .replace(/^\[object (.+)\]$/, '$1').toLowerCase()

/**
 * Judge type
 * @param {Any} thing see whattype()
 * @param {String} type compare with whattype's result
 * @return {Boolean}
 */
export const istype = (thing, type) => whattype(thing) === type

/**
 * a watcher hepler for states of storage relatived
 * @param {Object} store vuex's store
 * @param {Callback} callback a callback function will be called after watcher is working
 */
export const generateStorageWatchers = (store, callback) => {
  const helper = (key, state) =>
    key.split('.').reduce((prev, curr) => prev[curr], state)

  for (const [type, states] of Object.entries(store.state.storage)) {
    for (const key of states) {
      // store.watch(state => state[key], (curr, prev) => {
      store.watch(state => helper(key, state), (curr, prev) => {
        if (env.development) clog(type, key, `\n${JSON.stringify(curr)}`)

        callback(type, key, curr)
      }, { deep: true })
    }
  }
}

/**
 * dom string parsering helper
 * @param {String} domstr any dom string that can be parsed
 * @return {DOM}
 */
export const parserDOMString = domstr =>
  new DOMParser().parseFromString(domstr, 'text/html')

/**
 * like above, but return a array
 * @param {String} content dom string
 * @return {Array?} parserd NodeList or contains one Node's array
 */
export const stringToDOM = (content) => {
  if (istype(content, 'string')) {
    const parser = new DOMParser()

    return [...parser.parseFromString(content, 'text/html').body.childNodes]
  }

  return [content]
}

/**
 * avoid AMO checks `innerHTML`
 * @param {String} content dom string
 * @param {Element} target a dom node that will be injected
 */
export const injectHTML = (content, target) => {
  while (target.firstChild) target.removeChild(target.firstChild)

  stringToDOM(content).forEach(dom => target.appendChild(dom))
}
