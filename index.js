var h = require('hyperscript')

module.exports = function (img, selection_canvas, onCrop) {
  if('function' === typeof selection_canvas)
    onCrop = selection_canvas, selection_canvas = null

  onCrop = onCrop || function () {}

  selection_canvas = selection_canvas || h('canvas.hypercrop__selection', {width: 512, height: 512})

  var width = img.width
  var height = img.height

  var canvas = h('canvas.hypercrop__canvas', {
    width: width, height: height
  })
  canvas.selection = selection_canvas

  var ctx = canvas.getContext('2d')
  ctx.save()
  var selection_ctx = selection_canvas.getContext('2d')

  var down = false

  function coords(ev) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: ((ev.clientX-rect.left)/rect.width)*width,
      y: ((ev.clientY-rect.top)/rect.height)*height
    }
  }

  var start, end

  function square (start, end) {
    var side = Math.max(
      Math.abs(start.x - end.x),
      Math.abs(start.y - end.y)
    )

    var topleft = {
      x: (start.x < end.x) ? start.x : start.x - side,
      y: (start.y < end.y) ? start.y : start.y - side
    }

    // reset the canvas
    ctx.clearRect(
      0, 0,
      width, height
    )
    // fill the canvas with a translucent mask
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(
      0, 0,
      width, height
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
    selection_ctx.drawImage(img,
      start.x, start.y,
      bound.x, bound.y,
      0, 0, selection_canvas.width, selection_canvas.height
    )
  }

  canvas.onmousemove = function (e) {
    if(!down) return
    end = coords(e)
    ctx.drawImage(img, 0, 0)
    updateSelection()
  }

  canvas.onmousedown = function (ev) {
    down = true
    start = coords(ev)
    end = null
  }

  canvas.onmouseup = function (ev) {
    down = false
    end = coords(ev)
    onCrop(selection_canvas.toDataURL())
  }

  //default to select center square in image.
  //with a small border to show the crop effect
  var longest = Math.max(canvas.width, canvas.height)
  var shortest = Math.min(canvas.width, canvas.height)
  var edge = (longest - shortest)/2
  var pad = 20
  if(canvas.width > canvas.height)
    start = {x: edge + pad, y: pad}
  else
    start = {x: pad, y: edge + pad}

  end = {
    x: start.x + shortest - 2*pad,
    y: start.y + shortest - 2*pad
  }

  //default selection
  updateSelection()

  return canvas
}

