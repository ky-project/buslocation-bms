<template>
  <div class="head-nav">
      <h1 class="head-title">gps校车定位管理系统 v0.1</h1>
      <div class="head-toggle" title="关闭/打开侧栏" @click="$emit('fold')">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="head-info">
        <img class="avatar" src="./../assets/avatar.jpg" alt="">
        <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
                {{user}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="message">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">
                    <i class="el-icon-switch-button"></i>退出
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
  </div>
</template>

<script>
export default {
    name: 'head-nav',
    props: {
        user: {
            type: String,
            default: 'admin'
        }
    },
    methods: {
        handleCommand: function(command){
            switch(command){
                case 'message':
                    this.$emit('personalClick');
                    break;
                case 'logout':
                    this.logout();
                    break;
            }
        },
        logout: function(){
            //请求退出
            this.$axios.get('/busposition/logout')
                .then(res=>{
                    //清除vuex中的user
                    this.$store.dispatch('setUser',{});
                    //清除localStorage中的数据
                    localStorage.removeItem('bmsLogin');
                    localStorage.removeItem('userStore');
                    //跳转到登录界面
                    this.$router.push('/login');
                })
        }
    }
}
</script>

<style lang="less" scoped>
@headHeight: 45px;
@baseBgc: #222;
@toggleColor: #444;
@toggleHoverColor: #555;
.head-nav {
    padding: 0 15px;
    height: @headHeight;
    line-height: @headHeight;
    display: flex;
    justify-content: space-between;
    background-color: @baseBgc;
    .head-title {
        color: #fff;
        font-weight: bold;
    }
    .head-toggle {
        position: absolute;
        left: 220px;
        top: (@headHeight - 32px) / 2;
        width: 32px;
        height: 32px;
        background-color: #fff;
        border-radius: 3px;
        background-color: @toggleColor;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
            background-color: @toggleHoverColor;
        }
        span {
            position: absolute;
            width: 18px;
            height: 1px;
            background-color: #fff;
            left: 7px;
            &:nth-child(1){
                top: 11px;
            }
            &:nth-child(2){
                top: 16px;
            }
            &:nth-child(3){
                top: 21px;
            }
        }
    }
    .head-info {
        display: flex;
        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-top: (@headHeight - 30px) / 2;
            margin-right: 5px;
        }
        .el-dropdown-link {
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>
