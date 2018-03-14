<template>
   <div class="login-bg-wrapper">
      <el-row type="flex" justify="center" align="middle" style="height: 100%;">
         <el-col :span="16">
            <div class="login-img-wrapper">
               <img src="../../../../static/img/note.jpg" width="100%" height="100%">
            </div>
         </el-col>
         <el-col :span="6">
            <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm">
               <el-form-item label="帐号">
                  <el-input type="text" v-model="ruleForm.user" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item label="密码">
                  <el-input type="password" v-model="ruleForm.psd" auto-complete="off"></el-input>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" @click="submitForm" style="width: 100%;">登录</el-button>
               </el-form-item>
            </el-form>
         </el-col>
      </el-row>
   </div>
</template>
<script>
  export default {
    name: 'login',
    data () {
      return {
        ruleForm: {
          user: '',
          psd: ''
        }
      }
    },
    methods: {
      submitForm () {
        if (this.ruleForm.user === 'admin') {
          this.$router.push('/home')
        }
      }
    }
  }
</script>
<style>
  .login-bg-wrapper {
     background: #DADDD6;
     height: 100vh;
     width: 100%;
  }
  .login-img-wrapper {
     width: 50%;
     margin: 0 auto;
     animation: fadeIn 2s ease;
  }
  @keyframes fadeIn {
     from {
        opacity: 0;
        transform: translateY(200px);
     }
     to {
        opacity: 1;
        transform: translateY(0);
     }
  }
</style>
