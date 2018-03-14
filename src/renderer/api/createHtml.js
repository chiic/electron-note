function fakeClick (obj) {
  var ev = document.createEvent('MouseEvents')
  ev.initMouseEvent(
    'click', true, false, window, 0, 0, 0, 0, 0
    , false, false, false, false, 0, null
  )
  obj.dispatchEvent(ev)
}
export function createHtml (name, data) {
  var urlObject = window.URL || window.webkitURL || window
  var exportBlob = new Blob([data])
  var linkDiv = document.createElement('a')
  linkDiv.href = urlObject.createObjectURL(exportBlob)
  linkDiv.download = name
  fakeClick(linkDiv)
}
