import { weel as $ } from './libs/Weel'
import { wave, select } from './libs/ui/common'
import { input2translate } from './libs/ui/translation'
import { translate } from './libs/services/translation'
import { do_action, add_action } from './libs/functions'
import { PROPAGATION_OUTERMOST } from './libs/actions/types'

$('.translate.-js').register('click', input2translate(translate))

$('body').delegate('click',
  ev => do_action(PROPAGATION_OUTERMOST, ev),
  wave,
  select
)

add_action(PROPAGATION_OUTERMOST, ev => {
  $('.select.-js._on', ev.currentTarget).off()
})
