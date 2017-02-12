export const elems = {
  container: document.querySelector('.container'),
  mask: document.querySelector('.mask.-js'),
}

export const functions = {
  wave: ev => {
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
  },
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

functions['select'] = ev => {
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
