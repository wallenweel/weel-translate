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

const fn = {}
fn['wave'] = ev => {
  const rect = ev.target.offsetParent.getBoundingClientRect()
  const [ left, top ] = [
    ev.clientX - rect.x,
    ev.clientY - rect.y,
  ]

  const wave = document.createElement('span')
  wave.classList.add('wave')
  wave.style.left = `${left}px`
  wave.style.top = `${top}px`

  const target = ev.currentTarget
  target.appendChild(wave)
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

ui.textarea.addEventListener('keyup', fn.textarea, false)
ui.drawerMenu.addEventListener('click', fn.drawer, false)
ui.mask.addEventListener('click', fn.mask, false)
ui.wave.forEach(elem => elem.addEventListener('click', fn.wave, false))
