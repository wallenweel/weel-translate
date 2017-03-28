import { weel as $ } from "./libs/Weel"
import { wave, select } from "./libs/ui/common"
import { swapLanguages } from "./libs/ui/translation"
import { translate_from } from "./libs/actions"
import { log, do_action, add_action, i18n } from "./libs/functions"
import { settings } from "./libs/config"
import {
  container, toolbar, mask, drawer,
  closeDrawer, setTitle, inquiry, closeInquiry, toast,
} from "./libs/ui/popup"
import {
  PROPAGATION_OUTERMOST,
  MASK_MANUAL_HIDDEN,
  PAGE_IS_SWITCHING,

  CONNECT_WITH_TRANSLATING,
  TRANSLATE_IN_POPUP,
  TRANSLATE_QUERY_NONE,

  MESSAGE_IN_POPUP,
  RESPOND_TRANSLATING,

  SETTINGS_SET_SUCCESS,

  SET_LANGUAGES_FROM_TO,
} from "./libs/actions/types"

import translate, { apiPick } from "./libs/services/translation"
import synth from "./libs/services/synth"
import "./libs/actions/popup"

const scope = 'popup'
let port = {}

try {
  port = browser.runtime.connect({ name: CONNECT_WITH_TRANSLATING })
  port.onMessage.addListener(data => do_action(MESSAGE_IN_POPUP, data))
} catch (e) {}

/**
 * Application Container
 * @type {Closure}
 */
;(() => {
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
    $(container).data('actived-ui').add('drawer')
    $(mask).on()
  })

  $(mask).register('click', ev => {
    const $target = $(ev.currentTarget)

    closeInquiry()

    if (!$target.isOn()) return 0

    closeDrawer()

    do_action(MASK_MANUAL_HIDDEN, ev)
  })

  $(drawer).localizeHTML()

  $('nav.link-list > a.item', drawer)
  .localizeHTML()
  .register('click', ev => {
    ev.preventDefault()

    const target = ev.currentTarget

    $('main.content .page', container).pageSwitcher(target)
  })
})()

/**
 * Entry Page
 * @type {Closure}
 */
;(page => {
  setTitle('TRANSLATION')
  _initLanguagesBar()

  // Render Settings Page
  // add_action(`${PAGE_IS_SWITCHING}_ENTRY`, name => {
  //   setTitle('TRANSLATION')
  // })

  add_action(`CHANGED_SETTING_${'api_src'.toUpperCase()}`, _initLanguagesBar)

  const inputStream = page.querySelector('.input-stream')
  const streamBehavior = page.querySelector('.stream-behavior')
  const outputStream = page.querySelector('.output-stream')

  $(inputStream).localizeHTML()
  $(streamBehavior).localizeHTML()

  $('.language .-swap.-js', inputStream).ready(({ elem }) => {
    const {
      previousElementSibling,
      nextElementSibling,
    } = elem

    // $('.-opt', previousElementSibling).register('click', ({ target }) => {
    //   console.log(target)
    // })

    try {
      settings(['lang_from', 'lang_to']).get(({ lang_from, lang_to }) => {
        // if (!lang_from.text || !lang_to.text) return void 0

        do_action(
          SET_LANGUAGES_FROM_TO,
          [previousElementSibling, lang_from],
          [nextElementSibling, lang_to]
        )
      })
    } catch (e) {}
  }).register('click', swapLanguages)

  const $inputText = $('textarea', inputStream)

  $('.clear.-js', streamBehavior).register('click', $inputText.textArea().clear)

  // TODO: Test input, keep in mind that remove this
  // $inputText.textArea().in('全文翻译')

  const doTransalte = () => do_action(TRANSLATE_IN_POPUP, port)

  try {
    /** Auto Translate Selection That Selected From Content */
    settings('auto_translate_selection').get(({ auto_translate_selection }) => {
      if (!auto_translate_selection) return void 0

      browser.tabs.executeScript({
        code: 'window.getSelection().toString().trim();',
      }, (selection = []) => {
        if (!selection[0]) return void 0

        $inputText.textArea().in(selection[0])
        doTransalte()
      })
    })
  } catch (e) {}

  $inputText.register('keydown', ev => {
    const { keyCode, ctrlKey } = ev

    // Ctrl + Enter
    if (ctrlKey && keyCode === 13) {
      doTransalte()
    }
  })

  $('.translate.-js', streamBehavior).register('click', ev => doTransalte())

  $('.switch-translator.-js', streamBehavior).register('click', ev => {
    const apis = apiPick()

    settings('api_src').get(({ api_src }) => {
      apis.forEach((api, i) => {
        if (api_src === api.slug) {
          const src = apis[((i < apis.length - 1) ? (i + 1) : 0)]['slug']

          settings().set({ api_src: src })
          _initLanguagesBar(src)
        }
      })
    })
  })

  $('.voice.-js', outputStream).register('click', ev => {
    synth($inputText.textArea().out() || '')
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

  add_action(SET_LANGUAGES_FROM_TO, () => {
    $(result).off()
    // $inputText.textArea().clear()
  })

  function _initLanguagesBar(src) {
    try {
      browser.storage.local.get('api_src')
      .then(({ api_src }) => $('.language', inputStream).initLanguages(apiPick(api_src), src))
    } catch (e) {
      $('.language', inputStream).initLanguages(apiPick('youdao'), src)
    }
  }
})(document.querySelector('.page.-entry'))

/**
 * Settings Page
 * @type {Closure}
 */
;(page => {
  add_action(`${PAGE_IS_SWITCHING}_PREFERENCES`, name => {
    config_to_render(page)
  })

  $(page.querySelectorAll('input, textarea'))
  .filter(target => target.name.length)
  .register('change', ({ target }) => {
    const { name, value } = target

    try {
      settings().set({ [name]: value })
      do_action(SETTINGS_SET_SUCCESS, name, value)
    } catch (e) {}
  })

  function config_to_render(scope) {
    try {
      settings().get().then(cfg => {
        let targets = scope.querySelectorAll('input, textarea')

        targets = ([...targets]).filter(target => target.name.length)

        targets.forEach(target => {
          const { name, value } = target

          switch (target.type) {

          case 'radio':
            return (value === cfg[name]) ? (target.checked = true) : void 0

          case 'checkbox':
            return target.checked = cfg[name]

          default:
            return target.value = cfg[name]

          }
        })
      })
    } catch (e) {}
  }
})(document.querySelector('.page.-preferences'))

/**
 * Settings Page
 * @type {Closure}
 */
;(page => {
  // Render Settings Page
  add_action(`${PAGE_IS_SWITCHING}_SETTINGS`, name => {
    // setTitle('SETTINGS'

    try {
      const localStorage = browser.storage.local

      localStorage.get().then(cfg => {
        const {
          api_src,
          custom_api,
          use_fab, auto_translate_selection,
          auto_popup, use_fap,
        } = cfg

        page.querySelector(`input[name="api_src"][value="${api_src}"]`).checked = true
        page.querySelector(`textarea[name="custom_api"]`).value = custom_api
        page.querySelector(`input[name="use_fab"]`).checked = use_fab
        page.querySelector(`input[name="auto_translate_selection"]`).checked = auto_translate_selection

        // TODO: Unable to trigger popup page with `browserAction` by content script
        // page.querySelector(`input[name="auto_popup"]`).checked = auto_popup
        // page.querySelector(`input[name="use_fap"]`).checked = use_fap
      })
    } catch (e) {}
  })

  $('.-translator input[type="radio"][name]', page).register('change', _updateSettings)

  $('.-customAPI textarea[name]', page).register('blur', _updateSettings)

  $('.-interaction input[type="checkbox"][name]', page).register('change', _updateSettings)

  $('.reset-settings.-js', page).register('click', ev => {
    inquiry('确定要清除扩展的数据？', '操作会让扩展恢复到初次安装的状态。', {
      ok: ev => {
        settings().reset()
        browser.runtime.reload()
      },
      cancel: ev => void 0,
    })
  })

  $('.uninstall.-js', page).register('click', ev => {
    inquiry('确定要卸载 ...(｡•ˇ‸ˇ•｡) ... ？', i18n.get('UNINSTALL_DIALOG_MESSAGE'), {
      ok: ev => {
        browser.management.uninstallSelf()
      },
      cancel: ev => void 0,
    })
  })

  function _updateSettings(ev) {
    let { name, value, type, checked } = ev.target

    if (name === 'custom_api') {
      if (!value) return void 0

      try {
        JSON.parse(value)
      } catch (e) {
        return toast('请确保 JSON 格式正确！')
      }
    }

    if (type === 'checkbox') value = checked

    settings().set({ [name]: value })
      .then(() => do_action(SETTINGS_SET_SUCCESS, name, value))
  }
})(document.querySelector('.page.-settings'))
