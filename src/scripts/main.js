try {
  // console.log(document)

} catch (e) {

} finally {

}

const q = selector => {
  const list = document.querySelectorAll(selector)

  switch (list.length) {
  case 0:
    return null
  case 1:
    return list[0]
  default:
    return list
  }
}

const ui = {}
ui['container'] = q('.container')
ui['drawerMenu'] = q('.drawer-menu.-js')
ui['mask'] = q('.mask.-js')
ui['wave'] = q('.wave.-js')
ui['textarea'] = q('.input-stream .textarea.-js')
ui['select'] = q('.select.-js')
ui['lang_switch'] = q('.language .-switch.-js')

const fn = {}
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
  ev.preventDefault()
  ev.stopPropagation()

  const self = ev.currentTarget
  if (self.classList.contains('_on')) {
    self.setAttribute('data-text', ev.target.innerText)
    self.setAttribute('data-value', ev.target.getAttribute('data-value'))
    return self.classList.remove('_on')
  }

  self.classList.add('_on')
}

fn['lang_switch'] = ev => {
  const self = ev.currentTarget
  const lang = q('.input-stream .language')
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

ui.textarea.addEventListener('keyup', fn.textarea, false)
ui.drawerMenu.addEventListener('click', fn.drawer, false)
ui.mask.addEventListener('click', fn.mask, false)
ui.wave.forEach(elem => elem.addEventListener('click', fn.wave, false))
ui.select.forEach(elem => elem.addEventListener('click', fn.select, false))
ui.lang_switch.addEventListener('click', fn.lang_switch, false)

document.body.addEventListener('click', ev => {

  ui.select.forEach(elem => {
    if (elem.classList.contains('_on')) elem.classList.remove('_on')
  })
}, false)
