import Weel, { weel as $ } from './libs/Weel'
import { wave, select } from './libs/ui/common'
import { input2translate, swapLanguages } from './libs/ui/translation'
import { translate } from './libs/services/translation'
import { log, do_action, add_action } from './libs/functions'
import { PROPAGATION_OUTERMOST, MASK_MANUAL_HIDDEN } from './libs/actions/types'

/**
 * Application Container
 * @type {Closure}
 */
;(container => {
  const toolbar = container.querySelector('header.toolbar')
  const mask = container.querySelector('.mask.-js')
  const drawer = container.querySelector('.drawer')

  const closeDrawer = () => ($(container).data('unique-ui').del('drawer') || $(mask).off())
  // const closeDrawer = () => (container.setAttribute('data-unique-ui', '') || $(mask).off())

  $('body').delegate('click',
    ev => do_action(PROPAGATION_OUTERMOST, ev),
    wave,
    select
  )

  add_action(PROPAGATION_OUTERMOST, ev => {
    $('.select.-js._on', ev.currentTarget).off()

    closeDrawer()
  })

  $('.drawer-menu.-js', toolbar).register('click', ev => {
    $(container).data('unique-ui').set('drawer')
    $(mask).on()
  })

  $(mask).register('click', ev => {
    const $target = $(ev.currentTarget)

    if (!$target.isOn()) return 0

    closeDrawer()

    do_action(MASK_MANUAL_HIDDEN, ev)
  })

  $('nav.link-list > a.item', drawer).register('click', ev => {
    ev.preventDefault()

    const target = ev.currentTarget

    $('main.content .page', container).pageSwitcher(target)
  })
})(document.querySelector('.container'))

/**
 * Entry Page
 * @type {Closure}
 */
;(page => {
  const inputStream = page.querySelector('.input-stream')
  const streamBehavior = page.querySelector('.stream-behavior')
  const outputStream = page.querySelector('.output-stream')

  const inputText = $('textarea', inputStream)

  $('.language .-swap.-js', inputStream).register('click', swapLanguages)

  $('.clear.-js', streamBehavior).register('click', inputText.textArea().clear)
  $('.translate.-js', streamBehavior).register('click', input2translate(translate))
  $('.clipboard.-js', streamBehavior).register('click', ev => {
    // inputText.elem.dispatchEvent(event)
  })
})(document.querySelector('.page.-entry._on'))
