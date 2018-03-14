import db from '../../api/db.js'
const state = {
  notelistsdetail: null,
  notelistTitle: null
}
const mutations = {
  ADDNOTELISTS (state, obj) {
    var objLists = {
      name: '未定义文件',
      value: obj.value,
      indexID: obj.indexID,
      article: '',
      nowTime: obj.nowTime
    }
    state.notelistsdetail = objLists
    db.notelistsdetail.insert(objLists, (err, res) => {
      if (!err) {
      }
    })
  },
  CHANGETITLE (state, obj) {
    state.notelistTitle = obj.title
    db.notelistsdetail.update({
      indexID: parseInt(obj.indexID)
    }, {
      $set: {
        name: obj.title
      }
    }, (err, res) => {
      if (!err) {
      }
    })
  }
}
const actions = {
  addnotelists ({ commit }, obj) {
    commit('ADDNOTELISTS', obj)
  },
  changetitle ({commit}, obj) {
    commit('CHANGETITLE', obj)
  }
}
export default {
  state,
  mutations,
  actions
}
