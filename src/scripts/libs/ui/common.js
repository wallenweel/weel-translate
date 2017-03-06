import $ from '../Weel.js'

export const wave = ev => {
  const target = ev.target

  if (!$(target).isUI('wave')) return 0

  const wave = document.createElement('span')

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

export const select = ev => {
  const target = ev.target

  if (!$(target).isUI('select')) return 0

  ev.stopPropagation()

  if (target.classList.contains('_on')) {
    target.setAttribute('data-text', target.innerText)
    target.setAttribute('data-value', target.getAttribute('data-value'))
    return target.classList.remove('_on')
  }

  $('.select.-js._on', ev.currentTarget).off()

  target.classList.add('_on')
}
