export const type = (obj, val = '') => {
  const str = /(\w+)\]$/.exec(Object.prototype.toString.apply(obj).toLowerCase())[1]

  return !val ? str : (val === str)
}

export const log = (...params) => {
  console.log(...params)
}
