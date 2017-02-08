const ui = {}

ui.container = document.querySelector('.container')
ui.drawerMenu = document.querySelector('.drawer-menu.-js')
ui.mask = document.querySelector('.mask.-js')

ui.drawerMenu.addEventListener('click', ev => {
  ui.container.setAttribute('data-unique-ui', 'drawer')
  ui.mask.classList.add('_on')
}, false)

ui.mask.addEventListener('click', ev => {
  ui.container.setAttribute('data-unique-ui', '')
  ui.mask.classList.remove('_on')
})
