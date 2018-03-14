<template>
  <div class="nav-menu-wrapper">
    <ul style="margin-top: 20px;">
      <div v-for="(item, index) in menuItems">
        <router-link :to="{path: '/home/notelist', query: {key: item.key}}" style="text-decoration: none">
          <li class="mynote-menu-lists"
              @click.stop="selectMenuLisItem(index)"
              :class="{selectMenuItem: (index === selectMenuItem? true : false)}">
            <i :class="item.icon" style="margin-right: 10px;"></i>{{item.name}}
            <div v-if="item.id === 2"
                 @contextmenu="showContextMenuFa"
                 @click="showChildrenLists(item)"
                 class="mynote-menu-contextmenu">
              <vue-context-menu :contextMenuData="contextMenuDataFa"
                                @newfolder="newFolder">
              </vue-context-menu>
            </div>
          </li>
        </router-link>
      </div>
    </ul>
    <ul v-if="menuItems[1].children&&showChildMenuLists">
      <div class="mynote-menu-lists"
           v-for="(child, index) in menuItems[1].children">
        <router-link :to="{path: '/home/notelist', query: { value: child.value, key: 'allfolder'}}" style="text-decoration: none">
          <li class="mynote-menu-childItem"
              :title="child.value"
              :class="{selectChildMenuItem: (index === selectChildMenuItem? true : false)}"
              @click="selectChildMenuListItem(index)"
              @contextmenu.stop="showContextMenu(index)">
            <i class="note-menulist-icon"></i>
            <span class="note-menulist-name">{{child.value}}</span>
            <vue-context-menu :transferIndex="transferIndexChild"
                              :contextMenuData="contextMenuData"
                              @newfile="newFile(child)"
                              @deletefolder="deleteFolder(child, index)"></vue-context-menu>
          </li>
        </router-link>
      </div>
    </ul>
    <!-- dialog -->
    <el-dialog title="文件夹名称" :visible.sync="dialogFolderVisible" size="tiny">
      <el-input v-model="NotefolderName" auto-complete="off"></el-input>
      <div v-if="showErrorMessage" style="margin-top: 10px;font-size: 12px;letter-spacing: 2px;color: chocolate">* 名称重复</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFolderVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateFolderBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import db from '../../../api/db.js'
  export default {
    watch: {
      NotefolderName (val) {
        var _this = this
        db.notelists.find({value: val}, (err, res) => {
          if (!err) {
            if (res.length) {
              _this.showErrorMessage = true
            } else {
              _this.showErrorMessage = false
            }
          }
        })
      }
    },
    data () {
      return {
        dialogFolderVisible: false,
        NotefolderName: '',
        showErrorMessage: false,
        selectMenuItem: null,
        selectChildMenuItem: null,
        showChildMenuLists: false,
        menuItems: [
          {
            id: 1,
            name: '最新笔记',
            key: 'new',
            icon: 'el-icon-star-on'
          },
          {
            id: 2,
            name: '我的笔记',
            key: 'allfolder',
            icon: 'el-icon-arrow-down',
            children: []
          }
        ],
        contextMenuDataFa: {
          menuName: 'father',
          axios: {
            x: null,
            y: null
          },
          menulists: [
            {
              fnHandler: 'newfolder',
              icoName: 'fa fa-plus-circle fa-fw',
              btnName: '新建文件夹'
            }
          ]
        },
        transferIndexChild: null,
        contextMenuData: {
          menuName: 'child',
          axios: {
            x: null,
            y: null
          },
          menulists: [
            {
              fnHandler: 'newfile',
              icoName: 'fa fa-plus-circle fa-fw',
              btnName: '新建文件'
            },
            {
              fnHandler: 'deletefolder',
              icoName: 'fa fa-home fa-fw',
              btnName: '删除'
            }
          ]
        }
      }
    },
    methods: {
      selectMenuLisItem (index) {
        this.selectMenuItem = index
      },
      selectChildMenuListItem (index) {
        this.selectChildMenuItem = index
      },
      showChildrenLists (item) {
        this.showChildMenuLists = !this.showChildMenuLists
        item.icon = (item.icon === 'el-icon-arrow-down'
                                 ? 'el-icon-arrow-up'
                                 : 'el-icon-arrow-down')
      },
      validateFolderBtn () {
        var _this = this
        var folderName = _this.NotefolderName
        var time = this.getTime()
        var obj = {
          value: folderName,
          time: time
        }
        if ((!_this.showErrorMessage) && folderName) {
          db.notelists.insert(obj, (err, res) => {
            if (!err) {
              _this.$message({
                type: 'success',
                message: '新建'
              })
              _this.menuItems[1].children.push(res)
              _this.dialogFolderVisible = false
            }
          })
        }
      },
      newFolder () {
        this.dialogFolderVisible = true
      },
      dbSelectList (item) {
        if (!item.children) {
          return false
        } else {
          if (item.id === 3) {
            item.ico = (item.ico === 'el-icon-arrow-down' ? 'el-icon-arrow-up' : 'el-icon-arrow-down')
            this.navNoteDetail = !this.navNoteDetail
          }
        }
      },
      getTime () {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        var arr = [year, month, day, hour, minute, second]
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] < 10) {
            arr[i] = '0' + arr[i]
          }
        }
        var time = arr[0] + '-' + arr[1] + '-' + arr[2] + ' ' + arr[3] + ':' + arr[4] + ':' + arr[5]
        return time
      },
      newFile (child) {
        /* 产生随机数 */
        var indexID = Math.round(Math.random() * 10000000000)
        var nowTime = this.getTime()
        var childObj = {
          value: child.value,
          indexID: indexID,
          nowTime: nowTime
        }
        this.$store.dispatch('addnotelists', childObj)
      },
      deleteFolder (child, index) {
        var _this = this
        db.notelists.remove({value: child.value}, (err, res) => {
          if (err) {
            _this.$message({
              type: 'warning',
              message: '删除失败'
            })
          } else {
            _this.menuItems[1].children.splice(index, 1)
            db.notelistsdetail.remove({value: child.value}, (err, res) => {
              if (!err) {
                var childClick = _this.menuItems[1].children[0].value
                _this.selectChildMenuItem = 0
                _this.$router.push({path: '/home/notelist', query: {value: childClick, key: 'allfolder'}})
              }
            })
            db.notelistsdetail.remove({value: child.value}, (err, res) => {
              if (!err) {
              }
            })
          }
        })
      },
      showContextMenuFa () {
        event.preventDefault()
        var x = event.clientX
        var y = event.clientY
        this.contextMenuDataFa.axios = {
          x, y
        }
      },
      showContextMenu (index) {
        this.transferIndexChild = index
        event.preventDefault()
        var x = event.clientX
        var y = event.clientY
        this.contextMenuData.axios = {
          x, y
        }
      }
     /* newdata () {
        var _this = this
        this.$prompt('请输入邮箱', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          _this.menuItems[2].children.push({value})
          db.notelists.insert({value}, (err, res) => {
            if(!err) {
              _this.$message({
                type: 'success',
                message: '新建'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      } */
    },
    mounted () {
      var _this = this
      db.notelists.find({})
        .sort({time: 1})
        .exec((err, res) => {
          if (!err) {
            for (var i = 0; i < res.length; i++) {
              var value = res[i].value
              _this.menuItems[1].children.push({value})
            }
          }
        })
    }
  }
</script>
<style>
  .mynote-menu-lists {
    height: 50px;
    position: relative;
    line-height: 50px;
    color: #333333;
    border: 1px solid #eeeeee;
    text-decoration: none;
    text-align: center;
    font-weight: 900;
  }
  .mynote-menu-lists:hover {
    background: #e0e0e0;
    color: white;
  }
  .selectMenuItem {
    background: #ab9bab !important;
    color: white;
  }
  .selectChildMenuItem {
    background: #e0e0e0;
  }
  .mynote-menu-contextmenu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .note-menulist-icon {
    width: 18px;
    display: block;
    float: left;
    height: 15px;
    margin-top: 16px;
    margin-right: 10px;
    background: url("../../../../../static/img/icon-folder.png");
  }
  .mynote-menu-childItem {
    padding: 0 10% 0 30%;
    height: 100%;
    color: #333333;
    font-size: 14px;
    text-align: left;
    overflow: hidden;
  }
  .note-menulist-name {
    display: block;
    width: 50%;
    overflow: hidden;
    float: left;
  }
</style>
