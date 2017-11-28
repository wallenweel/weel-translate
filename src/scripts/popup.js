import { weel as $ } from "./libs/Weel"
import { wave, select } from "./libs/ui/common"
import { swapLanguages, config_to_render, option_to_config } from "./libs/ui/translation"
import { translate_from } from "./libs/actions"
import { log, getInputMeta, do_action, add_action, i18n } from "./libs/functions"
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

  $('.treat-paragraph.-js', toolbar).register('click', ev => {
    inquiry('暂未实现的“段落翻译”', '这种功能会占用太多免费翻译资源，所以目前没有继续开发👹。', {
      ok: ev => void 0,
    })
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
  $inputText.textArea().in('extensions')

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
    // if (ctrlKey && keyCode === 13) {
    if (ctrlKey && keyCode === 13) {
      const _val = ev.currentTarget.value

      ev.currentTarget.value = `${_val}\n`

      return
    } else if (keyCode === 13) {
      ev.stopPropagation()
      ev.preventDefault()

      doTransalte()
    }
  })

  $('.translate.-js', streamBehavior).register('click', ev => doTransalte())

  $('.switch-translator.-js', streamBehavior).register('click', ev => {
    const apis = apiPick()

    settings('api_src').get(({ api_src }) => {
      apis.forEach((api, i) => {
        if (api_src === api.slug) {
          const next_api = apis[((i < apis.length - 1) ? (i + 1) : 0)]
          const src = next_api['slug']

          settings().set({ api_src: src })
          _initLanguagesBar(src)

          toast(`已切换到 ${next_api['name']}`)
        }
      })
    })
  })

  $('.voice.-js', outputStream).register('click', ev => {
    settings().get(cfg => synth($inputText.textArea().out(), cfg))
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
      .children('.-plain').text(`us[ ${phonetic['us'] || '...'} ] uk[ ${phonetic['uk'] || '...'} ]`)

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
 * Preferences Page
 * @type {Closure}
 */
;(page => {
  $(page).localizeHTML()
  
  add_action(`${PAGE_IS_SWITCHING}_PREFERENCES`, name => {
    config_to_render(page)
  })

  $(page.querySelectorAll('input, textarea'))
    .filter(target => target.name.length)
    .register('change', ({ target }) => {
      const { name, value } = target

      try {
        option_to_config(target)
        do_action(SETTINGS_SET_SUCCESS, ...getInputMeta(target))
      } catch (e) {}
    })
})(document.querySelector('.page.-preferences'))

/**
 * Settings Page
 * @type {Closure}
 */
;(page => {
  // Render Settings Page
  $(page).localizeHTML()

  add_action(`${PAGE_IS_SWITCHING}_SETTINGS`, name => {
    config_to_render(page)
  })

  $(page.querySelectorAll('input, textarea'))
    .filter(target => target.name.length)
    .register('change', ({ target }) => {
      const { name, value } = target

      if (name === 'custom_api') {
        if (!value) return void 0

        try {
          JSON.parse(value)
        } catch (e) {
          return toast('请确保 JSON 格式正确！')
        }
      }

      try {
        option_to_config(target)

        do_action(SETTINGS_SET_SUCCESS, ...getInputMeta(target))
      } catch (e) {}
    })

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
})(document.querySelector('.page.-settings'))
