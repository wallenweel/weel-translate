import Weel, { weel as $ } from "../Weel"
import { do_action, i18n } from '../functions'
import {
  PAGE_IS_SWITCHING,
  SELECT_LACK_OPTIONS,
  SELECT_OPTION_CHANGED,
} from '../actions/types'

export const container = document.querySelector('.container')
export const toolbar = container.querySelector('header.toolbar')
export const mask = container.querySelector('.mask.-js')
export const drawer = container.querySelector('.drawer')

const $inquiry = $(container.querySelector('.inquiry'))

export const closeDrawer = () => ($(container).data('actived-ui').del('drawer') || $(mask).off())

/**
 * Set Page Title
 * @param {String} [title='']   Title text
 * @param {Number} [localize=1] Does open localize
 */
export const setTitle = (title = '', localize = 1) => {
  const r = !localize ? title : i18n.get(title)

  document.querySelector('header.toolbar > h1.title').innerText = r
}

export const closeInquiry = () => {
  $(mask).off()
  $inquiry.off()

  $('.-actions', $inquiry).elem.innerHTML = ''
}

export const toast = msg => {
  if (!msg) return void 0

  const $toast = $('.toast.-js')
  const _timeout = setTimeout(() => $toast.off() && clearTimeout(_timeout), 2000)

  if ($toast.isOn()) {
    $toast.off()
    clearTimeout(_timeout)
  }

  $('.-body', $toast).text(msg)
  $toast.on()
}

/**
 * Alert Component
 * @param  {String}   [title=''] Alert heading
 * @param  {String}   [msg='']   Message about topic
 * @param  {Object}   callbacks  Actions's function e.g. click [ok] or [cancel] button to do something
 */
export const inquiry = (title = '', msg = '', { ok, cancel }) => {
  const $heading = $('.-heading', $inquiry)
  const $body = $('.-body', $inquiry)
  const $actions = $('.-actions', $inquiry)

  $heading.text(title)
  $body.text(msg)

  const actions = {
    btn(cls = '', text = '', callback) {
      const btn = document.createElement('button')

      btn.setAttribute('class', 'wave -js')
      btn.classList.add(cls)
      btn.innerText = text

      btn.addEventListener('click', closeInquiry, false)

      if (callback) {
        btn.addEventListener('click', callback, false)
      }

      return btn
    },
    ok(callback) {
      return this.btn('yes', i18n.get('OKAY'), callback)
    },
    cancel(callback) {
      return this.btn('no', i18n.get('CANCEL'), callback)
    },
  }

  if (ok) {
    $actions.elem.appendChild(actions.ok(ok))
  }

  if (cancel) {
    $actions.elem.appendChild(actions.cancel(cancel))
  }

  $inquiry.on()
  $(mask).on()
}

Weel.prototype.pageSwitcher = function ({ href, innerText }) {
  const [ page, name ] = /\/([\w\-\_\.]+)\.html/.exec(href)
  const aim = this.sight(`.-${name}`)

  if ($(aim[0]).hasClass('_on') || !aim.length) return void 0

  do_action(PAGE_IS_SWITCHING, name)
  do_action(`${PAGE_IS_SWITCHING}_${name.toUpperCase()}`, name)

  setTitle(innerText, 0)

  this.off(this.elems)
  this.on(aim)
}

Weel.prototype.localizeHTML = function () {
  this.elems.forEach(elem => i18n.html(elem))

  return this
}
