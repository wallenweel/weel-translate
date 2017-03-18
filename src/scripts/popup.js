import Weel, { weel as $ } from './libs/Weel'
import { wave, select, setTitle } from './libs/ui/common'
import { swapLanguages } from './libs/ui/translation'
import { translate_from } from './libs/actions'
import { log, do_action, add_action } from './libs/functions'
import {
  PROPAGATION_OUTERMOST,
  MASK_MANUAL_HIDDEN,
  PAGE_IS_SWITCHING,

  CONNECT_WITH_TRANSLATING,
  TRANSLATE_IN_POPUP,
  TRANSLATE_QUERY_NONE,

  MESSAGE_IN_POPUP,
  RESPOND_TRANSLATING,

  SELECT_LACK_OPTIONS,
} from './libs/actions/types'

import translate, { apiPick } from './libs/services/translation'
import synth from './libs/services/synth'

const scope = 'popup'
let port = {}

try {
  port = browser.runtime.connect({ name: CONNECT_WITH_TRANSLATING })
  port.onMessage.addListener(data => do_action(MESSAGE_IN_POPUP, data))
} catch (e) {}

add_action(MESSAGE_IN_POPUP, ({ type, meta, payload }) => {
  switch (type) {

  case RESPOND_TRANSLATING:
    do_action(RESPOND_TRANSLATING, payload)
    do_action(`${RESPOND_TRANSLATING}_${meta.to.toUpperCase()}`, payload)
    break
  default:

  }
})

/**
 * Application Container
 * @type {Closure}
 */
;(container => {
  setTitle('TRANSLATION')

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

  $('nav.link-list > a.item', drawer)
  .localizeHTML()
  .register('click', ev => {
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
  // Render Settings Page
  add_action(`${PAGE_IS_SWITCHING}_ENTRY`, name => {
    setTitle('TRANSLATION')
  })

  const inputStream = page.querySelector('.input-stream')
  const streamBehavior = page.querySelector('.stream-behavior')
  const outputStream = page.querySelector('.output-stream')

  $(inputStream).localizeHTML()
  $(streamBehavior).localizeHTML()

  $('.language .-swap.-js', inputStream).register('click', swapLanguages)

  const $inputText = $('textarea', inputStream)

  $('.clear.-js', streamBehavior).register('click', $inputText.textArea().clear)

  // TODO: Test input, keep in mind that remove this
  $inputText.textArea().in('test')

  $('.translate.-js', streamBehavior).register('click', ev => do_action(TRANSLATE_IN_POPUP, {
    q: $inputText.textArea().out(),
    source: $('.language .-origin', inputStream).getAttr('data-value'),
    target: $('.language .-target', inputStream).getAttr('data-value'),
  }))

  $('.full-text.-js', streamBehavior).register('click', ev => {
    console.log('全文翻译')
  })

  $('.voice.-js', outputStream).register('click', ev => {
    synth($inputText.textArea().out() || 'test')
  })

  $('.copy.-js', outputStream).register('click', ev => {
    const target = ev.currentTarget.nextElementSibling
    const textarea = outputStream.querySelector('textarea.-fake.-js')

    textarea.value = target.innerText
    textarea.select()
    document.execCommand('copy')
  })

  const result = outputStream.querySelector('.result')
  const reference = outputStream.querySelector('.reference')

  add_action(TRANSLATE_IN_POPUP, params => {
    if (!params.q.length) return do_action(TRANSLATE_QUERY_NONE)

    port.postMessage(translate_from(scope, params))
  })

  add_action(`${RESPOND_TRANSLATING}_${scope.toUpperCase()}`, data => {
    const { explains, phonetic, translation } = data

    if (!translation.length) return void 0

    $(result).on()

    $('.-phonetic', result).on()
    .children('.-plain').text(`[ ${phonetic[0] || '...'} ]`)

    $('.-explain', result).on()
    .children('.-plain').text(`${translation.join(' ')}`)

    $('.-explain', result).on()
    .children('.-detail')[explains[0] ? 'on' : 'off']()
    .html(`${explains.join('<br>')}`)
  })

  add_action(TRANSLATE_QUERY_NONE, () => console.error('Need Enter Some Words For Translating!'))

  const api = apiPick('google')

  $('.language', inputStream).localizeHTML()
  .initLanguages(api)

  add_action(SELECT_LACK_OPTIONS, select => {
    if (!$(select.parentElement).hasClass('language')) return 0

    console.log(`${api.name} 不支持选择语言。`)
  })
})(document.querySelector('.page.-entry'))

/**
 * Settings Page
 * @type {Closure}
 */
;(page => {
  // Render Settings Page
  add_action(`${PAGE_IS_SWITCHING}_SETTINGS`, name => {
    setTitle('SETTINGS')

    try {
      const storage = browser.storage.local.get()

      storage.then(cfg => {
        const { api_src, use_fab, auto_popup, use_fap } = cfg

        page.querySelector(`input[name="api_src"][data-slug="${api_src}"]`).checked = true
        page.querySelector(`input[name="use_fab"]`).checked = use_fab
        page.querySelector(`input[name="auto_popup"]`).checked = auto_popup
        page.querySelector(`input[name="use_fap"]`).checked = use_fap
      })
    } catch (e) {}
  })
})(document.querySelector('.page.-settings'))
