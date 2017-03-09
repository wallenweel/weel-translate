import { weel as $ } from '../Weel'

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
  const select = $(target.parentElement).isUI('select') ? target.parentElement : target

  if (!$(select).isUI('select')) return 0

  ev.stopPropagation()
  ev.preventDefault()

  if ($(target).hasClass('-opt')) {
    select.setAttribute('data-text', target.textContent)
    select.setAttribute('data-value', target.getAttribute('data-value'))

    return select.classList.remove('_on')
  }

  $('.select.-js._on', ev.currentTarget).off()

  target.classList.add('_on')
}
