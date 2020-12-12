<template>
  <div class="login">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0" class="login-form">
      <div class="login-title">
        gps校车定位管理系统
        <img src="./../assets/aiwrap.png" alt="">
      </div>
      <el-form-item prop="workId">
        <el-input type="text" v-model="loginForm.workId" autocomplete="off" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="verifyCode" class="verify-code">
        <el-input type="text" v-model="loginForm.verifyCode" placeholder="验证码"></el-input>
        <img :src="codeUrl" @click="changeCodeUrl">
      </el-form-item>
      <el-form-item class="submit">
        <el-button :disabled="isClick" type="primary" @click="submitForm('loginForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
    name: 'login',
    data: function(){
      return {
        codeUrl:'',
        loginForm: {
          workId: '',
          password: '',
          verifyCode: '',
          loginType: 'manager',
        },
        rules: {
          workId: [
            {required: true, message: '请输入工号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, max: 20, message: '密码长度为5-20个字符', trigger: 'blur'}
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      isClick: function(){
        if(!this.loginForm.workId || !this.loginForm.password || !this.loginForm.verifyCode){
          return true;
        }else{
          return false;
        }
      }
    },
    created: function(){
      this.changeCodeUrl();
    },
    methods: {
      changeCodeUrl: function(){
        this.codeUrl = '/busposition/code/getVerifyCode?t='+this.getRndInteger(1,100000000);
      },
      getRndInteger: function(min, max) {
          return Math.floor(Math.random() * (max - min + 1) ) + min;
      },
      submitForm: function(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //请求验证
            this.loginRequest();
          }
        });
      },
      loginRequest: function(){
        // this.$axios.post('/busposition/user/admin/login', qs.stringify(this.loginForm))
        this.$axios.post('/busposition/login', this.loginForm)
          .then(res=>{
            if(res){
              //添加cookie
              //存储到vuex中
              this.$store.dispatch('setUser',res.data.data);
              //存储到localstorge中
              localStorage.setItem('bmsLogin',true);
              //跳转到首页
              this.$router.push('./index');
            }
          })
          .catch(error=>{
            //修改验证码
            this.changeCodeUrl(); 
          })
      },
    }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('./../assets/bg.jpg') no-repeat center;
  background-size: cover;
  .login-form {
    margin: 120px auto 0 auto;
    min-height: 420px;
    max-width: 420px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 4px;
    box-sizing: border-box;
    .submit {
      button {
        width: 100%;
        font-size: 16px;
      }
    }
    .login-title {
      width: 400px;
      height: 50px;
      position: relative;
      left: -58px;
      margin-bottom: 20px;
      padding-left: 60px;
      line-height: 50px;
      background: #409EFF;
      box-sizing: border-box;
      color: #fff;
      font-size: 20px;
      img {
        position: absolute;
        top: 50px;
        left: 0px;
      }
    }
    .verify-code {
      .el-input {
        width: 70%;
        margin-right: 1%;
      }
      img {
        width: 29%;
        height: 40px;
        vertical-align: bottom;
        cursor: pointer;
      }
    }
  }
}
</style>
