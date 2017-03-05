import $ from './libs/weel.js'

const logs = () => console.log('logssssssss')

const wave = ev => {
  if (!ev.target.classList.contains('wave')) return 0

  const wave = document.createElement('span')
  const target = ev.target

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

// $('.translate.-js').register('click', logs)
$('body').delegate('click',
  wave,
  ev => {
    console.log('contaner')
  }
)
