const Nedb = require('nedb')
const db = {}
db.notelists = new Nedb({
  filename: './data/notelists.db',
  autoload: true
})
db.notelistsdetail = new Nedb({
  filename: './data/notelistsdetail.db',
  autoload: true
})

export default db
