import Weel, { weel as $ } from './libs/Weel'
import { wave, select } from './libs/ui/common'
import { swapLanguages } from './libs/ui/translation'
import translate from './libs/services/translation'
import synth from './libs/services/synth'
import { log, do_action, add_action } from './libs/functions'
import {
  PROPAGATION_OUTERMOST,
  MASK_MANUAL_HIDDEN,
  PAGE_IS_SWITCHING,
  TRANSLATE_IN_POPUP,
  TRANSLATE_QUERY_NONE,
} from './libs/actions/types'

try {
  browser.storage.local.get()
  .then(conf => {
    console.log(conf)
  })
} catch (e) {

}

/**
 * Application Container
 * @type {Closure}
 */
;(container => {
  const toolbar = container.querySelector('header.toolbar')
  const mask = container.querySelector('.mask.-js')
  const drawer = container.querySelector('.drawer')

  const closeDrawer = () => ($(container).data('actived-ui').del('drawer') || $(mask).off())

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
    $(container).data('actived-ui').set('drawer')
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

  const $inputText = $('textarea', inputStream)

  $('.language .-swap.-js', inputStream).register('click', swapLanguages)

  $('.clear.-js', streamBehavior).register('click', $inputText.textArea().clear)
  $('.translate.-js', streamBehavior).register('click', ev => do_action(
    TRANSLATE_IN_POPUP,
    $inputText.textArea().out(),
    outputStream
  ))
  $('.full-text.-js', streamBehavior).register('click', ev => {
    console.log('全文翻译')
  })

  $('.voice.-js', outputStream).register('click', ev => {
    synth($inputText.textArea().out() || 'test')
  })

  $inputText.textArea().in('test')
  add_action(TRANSLATE_IN_POPUP, (text, con) => {
    // if (!text.length) return do_action(TRANSLATE_QUERY_NONE, con)

    const result = con.querySelector('.result')
    const reference = con.querySelector('.reference')

    translate({ q: text }).then(json => {
      const { explains, phonetic, translation } = json

      if (!translation.length) return void 0

      $(result).on()

      $('.-phonetic', result).on()
        .children('.-plain').text(`[${phonetic[0]}]`)

      $('.-explain', result).on()
        .children('.-plain').text(`${translation.join(' ')}`)

      $('.-explain', result).on()
        .children('.-detail').html(`${explains.join('<br>')}`)
    })
  })

  add_action(TRANSLATE_QUERY_NONE, () => {
    console.error('Need Enter Some Words For Translating!')
  })
})(document.querySelector('.page.-entry'))

/**
 * Settings Page
 * @type {Closure}
 */
;(page => {

  // Render after switch
  add_action(PAGE_IS_SWITCHING, name => {
    try {
      const storage = browser.storage.local.get()

      storage.then(cfg => render(cfg))
    } catch (e) {}
  })

  function render(cfg) {
    const { api_src, use_fab, auto_popup, use_fap } = cfg

    page.querySelector(`input[name="api_src"][data-slug="${api_src}"]`).checked = true
    page.querySelector(`input[name="use_fab"]`).checked = use_fab
    page.querySelector(`input[name="auto_popup"]`).checked = auto_popup
    page.querySelector(`input[name="use_fap"]`).checked = use_fap

  }
})(document.querySelector('.page.-settings'))
