var h = require('hyperscript')

module.exports = function (img, selection_canvas, onCrop) {
  if('function' === typeof selection_canvas)
    onCrop = selection_canvas, selection_canvas = null

  onCrop = onCrop || function () {}

  var c2 = selection_canvas = selection_canvas || h('canvas.hypercrop__selection', {width: 512, height: 512})

  var width = img.width
  var height = img.height

  var c = CANVAS = h('canvas.hypercrop__canvas', {
    width: width, height: height
  })
  c.selection = c2

  var ctx = c.getContext('2d')
  ctx.save()
  var ctx2 = c2.getContext('2d')

  var down = false

  function coords(ev) {
    var rect = c.getBoundingClientRect()
    return {
      x: ((ev.clientX-rect.left)/rect.width)*width,
      y: ((ev.clientY-rect.top)/rect.height)*height
    }
  }

  var start, end

  function square (topleft, bottomright) {
    // reset the canvas
    ctx.clearRect(
      0, 0,
      width, height
    )
    // fill the canvas with a translucent mask
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(
      0, 0,
      width, height
    )

    var side = Math.max(
      bottomright.x - topleft.x,
      bottomright.y - topleft.y
    )
    // cut a whole the the mask
    ctx.clearRect(
      topleft.x, topleft.y,
      side, side
    )

    // apply the image over the mask with a compositor
    ctx.globalCompositeOperation = 'source-out'
    ctx.drawImage(img, 0, 0)

    return {x: side, y: side}
  }

  function updateSelection () {
    var bound = square(start, end)
    ctx2.drawImage(img, 
      start.x, start.y,
      bound.x, bound.y,
      0, 0, c2.width, c2.height
    )
  }

  c.onmousemove = function (e) {
    if(!down) return
    end = coords(e)
    ctx.drawImage(img, 0, 0)
    updateSelection()
  }

  c.onmousedown = function (ev) {
    down = true
    start = coords(ev)
    end = null
  }

  c.onmouseup = function (ev) {
    down = false
    end = coords(ev)
    onCrop(c2.toDataURL())
  }

  //default to select center square in image.
  //with a small border to show the crop effect
  var longest = Math.max(c.width, c.height)
  var shortest = Math.min(c.width, c.height)
  var edge = (longest - shortest)/2
  var pad = 20
  if(c.width > c.height)
    start = {x: edge + pad, y: pad}
  else
    start = {x: pad, y: edge + pad}

  end = {
    x: start.x + shortest - 2*pad,
    y: start.y + shortest - 2*pad
  }

  //default selection
  updateSelection()

  return c
}

