export const elems = {
  container: document.querySelector('.container'),
  mask: document.querySelector('.mask.-js'),
}

export const functions = {}

functions['wave'] = ev => {
  const wave = document.createElement('span')
  const target = ev.currentTarget

  target.appendChild(wave)

  const rect = wave.offsetParent.getBoundingClientRect()
  const [ left, top ] = [
    ev.clientX - rect.x,
    ev.clientY - rect.y,
  ]

  wave.classList.add('wave')
  wave.style.left = `${left}px`
  wave.style.top = `${top}px`

  setTimeout(() => target.removeChild(wave), 2000)
}

functions['drawer'] = ev => {
  elems.container.setAttribute('data-unique-ui', 'drawer')
  elems.mask.classList.add('_on')
}

functions['mask'] = ev => {
  elems.container.setAttribute('data-unique-ui', '')
  elems.mask.classList.remove('_on')
}

functions['textarea'] = ev => {
  const target = ev.currentTarget
  const text = target.innerText

  if (/^\s*$/.test(text)) {
    target.classList.remove('_on')
    target.innerHTML = ''
  } else {
    target.classList.add('_on')
  }
}


functions['lang_swap'] = ev => {
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
