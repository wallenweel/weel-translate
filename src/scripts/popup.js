import $ from './libs/Weel.js'
import { wave, select } from './libs/ui/common.js'
import { input2translate } from './libs/ui/translation.js'
import { translate } from './libs/services/translation.js'

$('.translate.-js').register('click', input2translate(translate))

$('body').delegate('click', ev => {
  $('.select.-js._on', ev.currentTarget).off()
}, wave, select)
