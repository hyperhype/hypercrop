var h = require('hyperscript')

module.exports = function (img) {
  var width = img.width, height = img.height

  var c = CANVAS = h('canvas', {
    width: width, height: height,
    style: {width: '100%', height: '100%'}
  })

  var c2 = h('canvas', {
    width: 256, height: 256
  })

  c.selection = c2
  var ctx = X = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  ctx2 = c2.getContext('2d')

  console.log(c)

  ctx.save()

  function coords(ev) {
    var rect = c.getBoundingClientRect()
    return {
      x: ((ev.clientX-rect.left)/rect.width)*width,
      y: ((ev.clientY-rect.top)/rect.height)*height
    }
  }

  var start, end

  function square (topleft, bottomright) {
    var side = Math.max(
      bottomright.x - topleft.x,
      bottomright.y - topleft.y
    )
    ctx.fillRect(
      topleft.x, topleft.y,
      side, side
    )
    return {x: side, y: side}
  }

  function rect (topleft, bottomright) {
    ctx.fillRect(
      topleft.x, topleft.y,
      bottomright.x - topleft.x,
      bottomright.y - topleft.y
    )
  }

  c.onmousemove = function (e) {
    var point = coords(e)
    ctx.drawImage(img, 0, 0)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    if(start) {
        var bound = square(start, end || point)
        ctx2.drawImage(img, 
          start.x, start.y,
          bound.x, bound.y,
          0, 0, c2.width, c2.height
        )
    }
  }

  c.onmousedown = function (ev) {
    start = coords(ev)
    end = null
  }

  c.onmouseup = function (ev) {
    end = coords(ev)
  }

  return c
}














