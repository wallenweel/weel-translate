export const ui = {
  container: document.querySelector('.container'),
  mask: document.querySelector('.mask.-js'),
}

export const fn = {}

fn['wave'] = ev => {
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

fn['drawer'] = ev => {
  ui.container.setAttribute('data-unique-ui', 'drawer')
  ui.mask.classList.add('_on')
}

fn['mask'] = ev => {
  ui.container.setAttribute('data-unique-ui', '')
  ui.mask.classList.remove('_on')
}

fn['textarea'] = ev => {
  const target = ev.currentTarget
  const text = target.innerText

  if (/^\s*$/.test(text)) {
    target.classList.remove('_on')
    target.innerHTML = ''
  } else {
    target.classList.add('_on')
  }
}

fn['select'] = ev => {
  ev.stopPropagation()

  const self = ev.currentTarget
  if (self.classList.contains('_on')) {
    self.setAttribute('data-text', ev.target.innerText)
    self.setAttribute('data-value', ev.target.getAttribute('data-value'))
    return self.classList.remove('_on')
  }

  UI.q('.select.-js').off()

  self.classList.add('_on')
}

fn['lang_swap'] = ev => {
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
