<template>
  <div style="height: 100%;">
    <el-row style="height: 100%;">
      <el-col :span="6" style="border-right: 1px solid #cccccc;overflow-y: auto;overflow-x:hidden;height: 100%;">
        <div v-for="(notelist, index) in notelists"
             :key="notelist.id"
             class="notelist-title-wrapper"
             @contextmenu="showContextMenu(index)">
            <router-link :to="{path: '/home/notelist/detail' + $route.query.key, query: {value: notelist.value, indexID: notelist.indexID, key: $route.query.key}}"
                         style="text-decoration: none">
              <span class="notelist-title"
                  @click.stop="NotelistClickToggle(notelist)"
                  :class="{ notelisthasbeClick: (notelist.indexID === NotelistHasBeClick)? true : false}">
                <div class="notelist-title-detail">
                  <i class="el-icon-document" style="color: #398dee"></i><b style="color: #324157">&nbsp&nbsp{{notelist.name}}</b>
                </div>
                <div class="notelist-abstract">
                </div>
                <div class="file-type-wrapper">
                  <span>
                    <div class="file-type-ico"></div>
                    <div class="file-type-name">{{notelist.value}}</div>
                  </span>
                  <span v-if="$route.query.key === 'new'" class="file-type-time">
                    {{notelist.nowTime.substring(0,10)}}
                  </span>
                </div>
              </span>
            </router-link>
            <div class="notelist-title-delete" @click="deleteFile(notelist, index)">
              <i class="el-icon-circle-close"></i>
            </div>
          <vue-context-menu :transferIndex="transferIndex"
                            :contextMenuData="contextMenuData"
                            @outputHtml="outputHtml(index)"></vue-context-menu>
        </div>
      </el-col>
      <el-col :span="18" style="overflow: auto;height: 100%;">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import db from '../../../api/db.js'
  import { createHtml } from '../../../api/createHtml'
  export default {
    name: 'notelist',
    data () {
      return {
        NotelistHasBeClick: null,
        notelists: [],
        transferIndex: null,
        contextMenuData: {
          menuName: 'detailist',
          axios: {
            x: null,
            y: null
          },
          menulists: [
            {
              fnHandler: 'outputHtml',
              icoName: 'fa fa-home fa-fw',
              btnName: '导出HTML'
            }
          ]
        }
      }
    },
    watch: {
      '$route.query' (val) {
        if (val.key === 'new') {
          this.findnewDate()
        } else {
          this.findData()
        }
      },
      addlists () {
        this.notelists.push(this.addlists)
      }
    },
    computed: {
      addlists () {
        return this.$store.state.AddNote.notelistsdetail
      }
    },
    methods: {
      NotelistClickToggle (notelist) {
        this.NotelistHasBeClick = notelist.indexID
      },
      findnewDate () {
        db.notelistsdetail.find({})
          .sort({nowTime: -1})
          .limit(10).exec((err, res) => {
            if (!err) {
              this.notelists = res
            }
          })
      },
      findData () {
        var _this = this
        var value = _this.$route.query.value
        db.notelistsdetail.find({value})
          .sort({nowTime: 1})
          .exec((err, reslist) => {
            if (!err) {
              this.notelists = reslist
            }
          })
      },
      deleteFile (notelist, index) {
        var _this = this
        db.notelistsdetail.remove({indexID: notelist.indexID}, (err, res) => {
          if (!err) {
            _this.$message({
              type: 'success',
              message: '删除成功'
            })
            _this.notelists.splice(index, 1)
            var keyupdate = _this.$route.query.key
            _this.$router.push({path: '/home/notelist', query: {value: notelist.value, key: keyupdate}})
          }
        })
      },
      showContextMenu (index) {
        this.transferIndex = index // tranfer index to child component
        event.preventDefault()
        var x = event.clientX
        var y = event.clientY
        this.contextMenuData.axios = {
          x, y
        }
      },
      outputHtml (index) {
        var noteobj = this.notelists[index]
        var article = noteobj.article
        var title = noteobj.name
        article = '<html>' +
          '<head><meta charset="UTF-8"></head>' +
          '<body>' +
          "<h2 style='text-align: center'>" + title + '</h2>' +
        '<div>' + article + '</div>' +
        '</body>' +
        '</html>'
        createHtml('test.html', article)
      }
    },
    mounted () {
      if (this.$route.query.key === 'allfolder') {
        this.findData()
      } else {
        this.findnewDate()
      }
    }
  }
</script>
<style>
  .notelist-title-wrapper {
    width: 100%;
    border-bottom:1px solid #cccccc;
    position: relative;
    height: 125px;
  }
  .notelist-title {
    height: 125px;
    display: block;
    width: 100%;
    position: relative;
  }
  .notelist-title:hover {
    background: #F6F7F9;
  }
  .notelisthasbeClick {
    background: #E0EAFA !important;
  }
  .notelist-title-detail {
    padding: 10px 0 0 20px;
    font-family: "微软雅黑";
    font-size: 14px;
    font-weight: bold;
  }
  .file-type-wrapper {
    bottom: 10px;
    left: 20px;
    height: 15px;
    width: 100%;
    line-height: 15px;
    position: absolute;
    font-weight: bold;
    font-size: 12px;
  }
  .file-type-ico {
    float: left;
    width: 18px;
    height: 15px;
    margin-right: 10px;
    background: url(../../../../../static/img/icon-folder.png) no-repeat;
  }
  .file-type-name {
    height: 15px;
    color: #333333;
  }
  .notelist-title-delete {
    z-index: 999;
    position: absolute;
    top: 8px;
    display: none;
    right: 20px;
    color: #cccccc;
    cursor: pointer;
  }
  .notelist-title-delete:hover {
    color: #aaaaaa;
  }
  .notelist-title-wrapper:hover .notelist-title-delete {
    display: block;
  }
  .file-type-time {
    color: #AB9BAB;
    font-size: 12px;
    position: absolute;
    right: 20%;top: 2px;
  }
</style>
