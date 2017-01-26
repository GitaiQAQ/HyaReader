var WebTorrent = require('webtorrent')
var stream = require('readable-stream')

var client = new WebTorrent()

// Sintel, a free, Creative Commons movie
var torrentId = 'magnet:?xt=urn:btih:4f3554f85cecdc45a3fd79ff1b44d76270ea7d39&dn=als.md'
client.add(torrentId, function (torrent) {
  var interval = setInterval(function () {
    console.log('Lenght:' + torrent.downloaded + '\tProgress: ' + (torrent.progress * 100).toFixed(1) + '%')
  }, 100)
  torrent.on('wire', function (wire, addr) {
    console.log('connected to peer with address ' + addr)
  })

  // Torrents can contain many files. Let's use the first.
  var file = torrent.files[0]
  // Display the file by adding it to the DOM.
  // Supports video, audio, image files, and more!
  file.createReadStream().on('data', (chunk) => {
    console.log('got %d characters of string data\n', chunk.length, chunk);
  });
  torrent.on('done', function(){
    console.log('torrent finished downloading');
  })
})

// Human readable bytes util
function prettyBytes(num) {
  var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (neg) num = -num
  if (num < 1) return (neg ? '-' : '') + num + ' B'
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? '-' : '') + num + ' ' + unit
}