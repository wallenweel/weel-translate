import $ from './libs/Weel.js'
import * as ui from './libs/uis.js'

const logs = () => console.log('logssssssss')

$('.translate.-js').register('click', logs)
$.log($(document.querySelector('body')))


$('body').delegate('click', ev => {
  $('.select.-js._on').off()
},
  ui.wave,
  ui.select
)
