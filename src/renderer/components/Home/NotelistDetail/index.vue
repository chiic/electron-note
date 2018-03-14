<template>
  <div style="margin-top: 20px;">
    <el-form ref="form" v-model="form" label-width="50px" style="margin-right: 10px;">
      <el-form-item label="标题">
        <el-input v-model="form.title" @blur="insertTitle"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin: auto 10px;">
      <vue-html5-editor :content="content"
                        :height="600"
                        :auto-height="true"
                        @change="updateContent"></vue-html5-editor>
    </div>
  </div>
</template>
<script>
  import db from '../../../api/db'
  export default {
    name: 'detail',
    data () {
      return {
        content: ' ',
        editorOption: {},
        form: {
          title: null
        }
      }
    },
    watch: {
      '$route.query' () {
        this.updateData()
      },
      content (val) {
        var indexID = this.$route.query.indexID
        indexID = parseInt(indexID)
        db.notelistsdetail.update({indexID}, {
          $set: {
            article: val
          }
        }, (err, res) => {
          if (!err) {
          }
        })
      }
    },
    methods: {
      updateContent (e) {
        this.content = e
      },
      updateData () {
        var _this = this
        var indexID = this.$route.query.indexID
        indexID = parseInt(indexID)
        db.notelistsdetail.find({indexID}, (err, res) => {
          if (!err) {
            _this.content = res[0].article
            if (res[0].name === '未定义文件') {
              _this.form.title = ''
            } else {
              _this.form.title = res[0].name
            }
          }
        })
      },
      insertTitle () {
        var title = this.form.title
        var indexID = this.$route.query.indexID
        var obj = { title, indexID }
        this.$store.dispatch('changetitle', obj)
      }
    },
    mounted () {
      this.updateData()
    }
  }
</script>
