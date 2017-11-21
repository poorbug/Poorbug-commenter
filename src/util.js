const util = {
  addPrefix (title) {
    return `poorbug-commenter-${title}`
  },
  formatTime (date) {
    var paddy = (n, p, c) => {
    var padChar = typeof c !== 'undefined' ? c : '0'
    var pad = new Array(1 + p).join(padChar)
    return (pad + n).slice(-pad.length)
    }

    date = new Date(date)
    var yyyy = date.getFullYear()
    var M = date.getMonth() + 1
    var MM = paddy(M, 2)
    var d = date.getDate()
    var dd = paddy(d, 2)
    var hh = paddy(date.getHours(), 2)
    var mm = paddy(date.getMinutes(), 2)
    var ss = paddy(date.getSeconds(), 2)
    return yyyy+'-'+MM+'-'+dd+' '+hh+':'+mm+':'+ss
  }
}

export default util;
