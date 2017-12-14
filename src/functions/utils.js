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

export const injectHTML = (content, obj) => {
  if (!content) return void 0

  const target = obj
  let doms = [content]

  if (whattype(content) === 'string') {
    const parser = new DOMParser()

    doms = [...parser.parseFromString(content, 'text/html').body.childNodes]
  }

  while (target.firstChild) target.removeChild(target.firstChild)

  doms.forEach(dom => target.appendChild(dom))
}
