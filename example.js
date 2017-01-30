
// to run, use
//   electro example.js {image_file_name}
// or
//   electro example.js
// to use file selector.

var h = require('hyperscript')

var hyperfile = require('hyperfile')
var hypercrop = require('./')

function cropper (img) {
  img.onload = function () {
    var crop = hypercrop(img)
    document.body.appendChild(crop)
    document.body.appendChild(crop.selection)
  }
}

if(process.argv[2]) //electro
  cropper(h('img', {src: process.argv[2] }))
else
  document.body.appendChild(hyperfile(function (buffer) {
    cropper(h('img', {src: 'data:image/jpg;base64,'+new Buffer(buffer).toString('base64')}))
  }))






