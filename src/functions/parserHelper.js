const pathToArray = (path) => path.split(/\b(?=\()/)
.reduce((a, e, i, p) => {
  // type one: a.b.c
  if (p.length === 1) return path.split('.').reverse()

  // type two: a.b(,c,d)
  if (/\(.+\)$/.test(e)) { // (,c,d) part
    // custom separator
    const separator = e.replace(/\((.+)\)/, '$1').split(/[\w._-]+/)[1]
    // custom key of targets
    const targets = e.match(/([\w._-]+)/g)

    a.unshift([targets, separator])
  } else { // a.b part
    a.unshift(...e.split('.').reverse())
  }

  return a
}, [])

const helper = (path, response) => path.reduceRight((r, k) => {
  if (typeof r === 'undefined') return undefined
  if (typeof r === 'string') return r

  if (typeof k === 'string') {
    // use `$` from last one
    if (/\$+/.test(k)) {
      // `$$` is last but one and so on
      k = r.length - k.split(/\B/).length
    }

    return r[k]
  }

  const [targets, separator] = k
  const _separator = separator === '////' ? '\n' : (separator || '')

  return r.reduce((a, v) => {
    const value = targets
      // get all target properties in objects of array
      ? targets.reduce((p, k) => {
        const _value = k.split('.').reduce((v, k) => v[k], v)

        return _value ? p.push(_value) && p : null
      }, [])
      // if only has separator e.g. `(,)`
      : [v]

    // remove useless value
    return (value ? a.push(value.join(_separator)) : true) && a
  }, [])
}, response)

export default ({ parser }) => {
  const serialized = Object.values(parser).reduce((o, path) => {
    if (typeof path === 'string') o[path] = pathToArray(path)

    if (typeof path === 'object' && !!path) {
      for (const p of Object.values(path)) o[p] = pathToArray(p)
    }

    return o
  }, {})

  return (response, result = {}) => Object.entries(parser).reduce((r, [key, path]) => {
    if (typeof path === 'string') {
      if (/\/\*.+\*\//.test(path)) {
        r[key] = path.match(/\/\*(.+)\*\//)[1]
      } else {
        r[key] = helper(serialized[path], response)
      }
    } else {
      r[key] = Object.values(path).reduce((a, path) =>
        a.push(helper(serialized[path], response)) && a, [])
    }

    return r
  }, result)
}
