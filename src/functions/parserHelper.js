export default ({ parser }) => {
  // TODO: check parser is valid
  const reserve = Object.keys(parser).reduce((p, k) => {
    p[k] = parser[k].split('.')

    if (/\(.+\)$/.test(p[k])) {
      const [name, keys] = p[k].pop().split(/\b(?=\()/)
      // custom separator
      const separator = keys.replace(/\((.+)\)/, '$1').split(/[\w_-]+/)[1]
      // custom key of targets
      const targets = keys.match(/([\w_-]+)/g)

      p[k].push(name, [targets, separator])
      // reverse it, check in out by first element is array
      // use `reduceRight` get value from response
      p[k].reverse()
    }

    return p
  }, {})

  return (response, result = {}) => {
    for (const [key, keys] of Object.entries(reserve)) {
      // normal type
      if (typeof keys[0] === 'string') {
        result[key] = keys.reduce((res, k) => {
          if (typeof res === 'undefined') return undefined

        // use `$` from last one
          if (/\$+/.test(k)) {
            // `$$` is last but one and so on
            k = res.length - k.split(/\B/).length
          }

          return res[k]
        }, response)

        continue
      }

      // special type like `a.b(a, b)`, due to treat object
      // in array `{a: {b: [{a, b},...{a, b}]}`
      result[key] = keys.reduceRight((res, k) => {
        if (typeof res === 'undefined') return undefined

        if (typeof k === 'string') {
          return res[k]
        }

        const [targets, separator] = k
        // `\\\\` can be `\n`
        const _separator = separator === '\\\\' ? '\n' : (separator || '')

        return res.reduce((a, v) => {
          const value = targets
            // get all target properties in objects of array
            ? targets.reduce((p, k) => v[k] ? p.push(v[k]) && p : null, [])
            // if only has separator e.g. `(,)`
            : [v]

          // remove useless value
          return (value ? a.push(value.join(_separator)) : true) && a
        }, [])
      }, response)
    }

    return result
  }
}
