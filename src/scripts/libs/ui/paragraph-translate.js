const smartMask = document.createElement('weel')

smartMask.id = 'weel__paragraph-translate-mask'

const styles = [
  'background-color: rgba(0, 0, 0, .5)',
  'left: 0',
  'top: 0',
  'z-index: 999999999',
  'position: fixed',
  'display: block',
]

smartMask.setAttribute('style', styles.join('; '))

document.body.appendChild(smartMask)

// document.body.addEventListener('mousemove', ev => {
//   const { target } = ev
//   const {
//     clientHeight, clientWidth,
//     offsetTop, offsetLeft,
//   } = target
//
//   if (target === smartMask) {
//     smartMask.style.height = `${0}px`
//     smartMask.style.width = `${0}px`
//     smartMask.style.top = `${0}px`
//     smartMask.style.left = `${0}px`
//
//   } else {
//     smartMask.style.height = `${clientHeight}px`
//     smartMask.style.width = `${clientWidth}px`
//     smartMask.style.top = `${offsetTop}px`
//     smartMask.style.left = `${offsetLeft}px`
//   }
//
//   // console.log(ev)
// }, false)
