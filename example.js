

var h = require('hyperscript')

var hyperfile = require('hyperfile')
var hypercrop = require('./')

//var fileinput = hyperfile(function (buffer) {
//  BUF = buffer
//  var img = h('img', {src: 
//      'data:image/jpg;base64,'+buffer.toString('base64')
//    })

var img = h('img', {src: '/home/dominic/pictures/IMG_20150905_101949.jpg'})

  console.log(img.width, img.height)
//  document.body.appendChild(img)
  img.onload = function () {
    console.log(img.width, img.height)
  
    var crop = hypercrop(img)
    document.body.appendChild(crop)
    document.body.appendChild(crop.selection)
  }
//})

//document.body.appendChild(h('div', fileinput))











