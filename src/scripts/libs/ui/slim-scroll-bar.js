import { weel as $ } from "../weel"

const $slimScrollCon = $('.slim-scroll-container')

const SlimScrollBar = (con) => {
  const wrap = con.querySelector('.-wrap')
  const bar = con.querySelector('.-bar.-js')
  const percent = wrap.clientHeight / wrap.scrollHeight * 100

  bar.style.height = `${percent}%`

  let iy = 0
  let pos_y

  con.addEventListener('DOMMouseScroll', ev => {
    // if (0 >= pos_y) return pos_y = .01
    // if ((100 - percent) < pos_y) pos_y = 100 - percent
    console.log(iy)
    if (pos_y < 0) {
      pos_y = iy = 0

      return true
    }
    if (pos_y > (100 - percent)) {
      pos_y = 100 - percent
      // iy = wrap.scrollHeight - wrap.clientHeight

      return true
    }

    console.log(pos_y)

    if ((100 - percent) > pos_y > 0){
      if (ev.detail > 0) {
        iy += 10
      } else {
        iy -= 10
      }
    }

    pos_y = iy / (wrap.clientHeight) * 100


    wrap.scrollTop = iy
    bar.style.webkitTransform = `translate3D(0, ${pos_y}%, 0)`
  })
}

SlimScrollBar($slimScrollCon.elem)
