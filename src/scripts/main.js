try {
  // console.log(document)

} catch (e) {

} finally {

}

const q = selector => document.querySelectorAll(selector)

const ui = {}
ui['container'] = q('.container')
ui['drawerMenu'] = q('.drawer-menu.-js')
ui['mask'] = q('.mask.-js')
ui['wave'] = q('.wave.-js')
ui['textarea'] = q('.input-stream .textarea.-js')
ui['select'] = q('.select.-js')
ui['lang_swap'] = q('.language .-swap.-js')
ui['mark'] = q('button.mark.-js')

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
  ui.container[0].setAttribute('data-unique-ui', 'drawer')
  ui.mask[0].classList.add('_on')
}

fn['mask'] = ev => {
  ui.container[0].setAttribute('data-unique-ui', '')
  ui.mask[0].classList.remove('_on')
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

fn['lang_swap'] = ev => {
  const self = ev.currentTarget
  const lang = q('.input-stream .language')[0]
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

fn['mark'] = ev => {
  ev.currentTarget.classList.toggle('_on')
}

ui.textarea[0].addEventListener('keyup', fn.textarea, false)
ui.drawerMenu[0].addEventListener('click', fn.drawer, false)
ui.mask[0].addEventListener('click', fn.mask, false)
ui.wave.forEach(elem => elem.addEventListener('click', fn.wave, false))
ui.select.forEach(elem => elem.addEventListener('click', fn.select, false))
ui.lang_swap[0].addEventListener('click', fn.lang_swap, false)
ui.mark[0].addEventListener('click', fn.mark, false)

document.body.addEventListener('click', ev => {

  ui.select.forEach(elem => {
    if (elem.classList.contains('_on')) elem.classList.remove('_on')
  })
}, false)
