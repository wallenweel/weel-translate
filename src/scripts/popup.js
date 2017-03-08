import Weel, { weel as $ } from './libs/Weel'
import { wave, select } from './libs/ui/common'
import { input2translate, swapLanguages } from './libs/ui/translation'
import { translate } from './libs/services/translation'
import { do_action, add_action } from './libs/functions'
import { PROPAGATION_OUTERMOST } from './libs/actions/types'

((con) => {
  const inputStream = con.querySelector('.input-stream')
  const streamBehavior = con.querySelector('.stream-behavior')
  const outputStream = con.querySelector('.output-stream')

  const inputText = $('textarea', inputStream)

  $('.language .-swap.-js', inputStream).register('click', swapLanguages)

  $('.clear.-js', streamBehavior).register('click', inputText.textArea().clear)
  $('.translate.-js', streamBehavior).register('click', input2translate(translate))
  $('.clipboard.-js', streamBehavior).register('click', ev => {
    // inputText.elem.dispatchEvent(event)
  })

})(document.querySelector('.page.-entry._on'))

$('body').delegate('click',
  ev => do_action(PROPAGATION_OUTERMOST, ev),
  wave,
  select
)

add_action(PROPAGATION_OUTERMOST, ev => {
  $('.select.-js._on', ev.currentTarget).off()
})
