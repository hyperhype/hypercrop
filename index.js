var h = require('hyperscript')

module.exports = function (img, onCrop) {
  onCrop = onCrop || function () {}
  var width = img.width, height = img.height

  var c = CANVAS = h('canvas.hypercrop__canvas', {
    width: width, height: height
  })

  var c2 = h('canvas', {
    width: 512, height: 512
  })

  c.selection = c2
  var ctx = X = c.getContext('2d')
  ctx.drawImage(img, 0, 0)
  //show selection as shadown region.
  //TODO: invert this so unselected portion is in shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx2 = c2.getContext('2d')

  var down = false

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
  var longest = Math.max(c.width, c.height)
  var shortest = Math.min(c.width, c.height)
  var edge = (longest - shortest)/2
  if(c.width > c.height)
    start = {x: edge, y: 0}
  else
    start = {x: 0, y: edge}

  end = {x: start.x+shortest, y: start.y + shortest}

  //default selection
  updateSelection()

  return c
}



