import merge from 'deepmerge'
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
 * What is its type
 * @param {Any} thing something is need to get type
 * @return {String} type name in lower case, e.g. object ...
 */
export const whattype = thing =>
  Object.prototype.toString.call(thing)
  .match(/\w+/g)[1].toLowerCase()

/**
 * Judge type
 * @param {Any} thing see whattype()
 * @param {String} type compare with whattype's result
 * @return {Boolean}
 */
export const istype = (thing, type) => whattype(thing) === type

export const generateStorageWatchers = (store, callback) => {
  const helper = (key, state) =>
    key.split('.').reduce((prev, curr) => prev[curr], state)

  for (const [type, states] of Object.entries(store.state.storage)) {
    for (const key of states) {
      // store.watch(state => state[key], (curr, prev) => {
      store.watch(state => helper(key, state), (curr, prev) => {
        console.log(type, merge({}, curr))
        callback(type, key, curr)
      }, { deep: true })
    }
  }
}

export const stringToDOM = (content) => {
  if (istype(content, 'string')) {
    const parser = new DOMParser()

    return [...parser.parseFromString(content, 'text/html').body.childNodes]
  }

  return [content]
}

export const injectHTML = (content, target) => {
  while (target.firstChild) target.removeChild(target.firstChild)

  stringToDOM(content).forEach(dom => target.appendChild(dom))
}
