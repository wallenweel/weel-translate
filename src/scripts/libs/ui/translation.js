export const lang_swap = ev => {
  const self = ev.currentTarget
  const lang = document.querySelector('.input-stream .language')
  const [ origin, dest ] = [
    lang.querySelector('.-origin'),
    lang.querySelector('.-destination'),
  ]
  const [ ov, ot, dv, dt ] = [
    origin.getAttribute('data-value'),
    origin.getAttribute('data-text'),
    dest.getAttribute('data-value'),
    dest.getAttribute('data-text'),
  ]

  origin.setAttribute('data-value', dv)
  origin.setAttribute('data-text', dt)
  dest.setAttribute('data-value', ov)
  dest.setAttribute('data-text', ot)
}

export const textarea = ev => {
  const target = ev.currentTarget
  const text = target.innerText

  if (/^\s*$/.test(text)) {
    target.classList.remove('_on')
    target.innerHTML = ''
  } else {
    target.classList.add('_on')
  }
}

export const input2translate = service => {
  return ev => {
    service({ q: 'test' })
  }
}
