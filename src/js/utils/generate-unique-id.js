// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
export function generateUniqueID () {
  var d = new Date().getTime()
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
