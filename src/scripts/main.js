import UI from './libs/UI.js'
import { fn, ui } from './libs/storage.js'

UI.q('.wave.-js').register('wave')('click')
UI.q('.drawer-menu.-js').register('drawer')('click')
UI.q('.mask.-js').register('mask')('click')
UI.q('.mark.-js').register('mark')('click', ev => ev.currentTarget.classList.toggle('_on'))
UI.q('.select.-js').register('select')('click')
UI.q('.language .-swap.-js').register('lang_swap')('click')
UI.q('.input-stream .textarea.-js').register('textarea')('keyup')

UI.q('.drawer .link-list > a.item').register('page_link')('click', ev => {
  ev.preventDefault()
  ev.stopPropagation()

  const target = ev.currentTarget
  const link = target.href

  ui.container.setAttribute('data-unique-ui', '')
  UI.q('.mask.-js').off()

  return router(link)
})

function router(link) {
  const match = /.+\/(([\w\d\-\_]+)\.html)$/.exec(link)
  const page = match[1]
  const page_name = match[2]

  const page_showed = ui.content.querySelector('.page._on')
  const page_ready = ui.content.querySelector(`.page.-${page_name}`)

  if (page_ready) {
    page_ready.classList.add('_on')
  } else {
    const new_page = page(link)
    new_page.classList.add('_on')
  }

  if (page_showed !== page_ready) page_showed.classList.remove('_on')
}

function page(link, sync = false) {}

document.body.addEventListener('click', ev => {
  UI.q('.select.-js').off()

  // browser.storage.sync.get(null)
  // .then(res => console.log(res))
  // browser.runtime.sendMessage({
  //   greeting: "Greeting from the content script",
  // })
}, false)
