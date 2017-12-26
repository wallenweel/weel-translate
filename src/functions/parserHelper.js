const pathToArray = (path) => path.split('.')
.reduce((a, e) => {
  if (/\(.+\)$/.test(e)) {
    const [name, keys] = e.split(/\b(?=\()/)
    // custom separator
    const separator = keys.replace(/\((.+)\)/, '$1').split(/[\w_-]+/)[1]
    // custom key of targets
    const targets = keys.match(/([\w_-]+)/g)

    a.unshift([targets, separator], name)
  } else {
    a.unshift(e)
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
      ? targets.reduce((p, k) => v[k] ? p.push(v[k]) && p : null, [])
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
      r[key] = helper(serialized[path], response)
    } else {
      r[key] = path.reduce((a, path) => a.push(helper(serialized[path], response)) && a, [])
    }

    return r
  }, result)
}
