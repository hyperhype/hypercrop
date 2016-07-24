# hypercrop

simple image cropper, good with hyperscript.

``` js
var h = require('hyperscript')
var hypercrop = require('hypercrop')
var hyperfile = require('hyperfile')

document.body.appendChild(
  hyperfile.asDataURL(function (src) {
    document.body.appendChild(
      //once the user selects a range, callback with that selection as a dataurl.
      hypercrop(
        h('img', {src: src}),
        //canvas to write selection into (optional) defaults to this size.
        //this does not need to be attached to the dom.
        h('canvas', {width: 512, height: 512}),
        function onCrop (src2) {
        
      })
    )
  })
)
```

currently only square selections are supported.

## License

MIT

