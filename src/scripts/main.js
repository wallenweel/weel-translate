import UI from './libs/UI.js'
import { functions as fn, elems as ui } from './libs/storage.js'


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

UI.q('.wave.-js').register('wave')('click')
UI.q('.drawer-menu.-js').register('drawer')('click')
UI.q('.mask.-js').register('mask')('click')
UI.q('.mark.-js').register('mark')('click', ev => ev.currentTarget.classList.toggle('_on'))
UI.q('.select.-js').register('select')('click')
UI.q('.language .-swap.-js').register('lang_swap')('click')
UI.q('.input-stream .textarea.-js').register('textarea')('keyup')

document.body.addEventListener('click', ev => {
  UI.q('.select.-js').off()
}, false)
