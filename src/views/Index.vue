<template>
  <el-container id="index">
    <!-- 顶部导航栏 -->
    <!-- <el-header class="header">
      <HeadNav  
        :user="userName"
        @fold="isfold = !isfold"
        @personalClick="showTab({title: '个人信息', viewName: 'personal', path: '/personal'})"
      />
    </el-header> -->
    <el-header class="header">
      <HeadNav  
        :user="userName"
        @fold="isfold = !isfold"
        @personalClick="showPersonal"/>
    </el-header>
    <!-- 中部 -->
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside class="aside" v-show="!isfold" key="aside">
          <LeftMenu :items="menuItems"/>
      </el-aside>
      <!-- 主要内容区 -->
      <el-main class="main" key="main">
        <!-- 选项卡 -->
        <!-- <MainTab ref="mainTab"/> -->
        <MainTab/>
      </el-main>
    </el-container>
    <!-- 底部 -->
    <el-footer class="footer">
        <!-- <p>Copyright &copy;2019 busposition-bms 0.1 All Rights Reserved</p> -->
        <p>Copyright &copy;2019 uLearning All Rights Reserved</p>
    </el-footer>
  </el-container>
</template>

<script>
import bus from './../busEvent';
import HeadNav from './../components/HeadNav.vue';
import LeftMenu from './../components/LeftMenu.vue';
import MainTab from './../components/MainTab.vue';

export default {
    name: 'index',
    data: function(){
      return {
        menuItems: [], //侧边栏数据
        userName: this.$store.getters.user.realName || 'admin',
        isfold: false,
      }
    },
    components: {
      HeadNav,
      LeftMenu,
      MainTab,
    },
    created(){
      this.getUserAuthority();
    },
    mounted(){
      bus.$emit('addTab',{title:"Home",componentName:'home',isShow:true})
    },
    methods: {
      // showTab(tabMes){
      //   this.$refs.mainTab.addTab(tabMes);
      // },
      showPersonal(){
        bus.$emit('addTab',{title: '个人信息', componentName: 'personal',isShow:true});
      },
      getUserAuthority(){
        //保存authority到vuex中
        let authority = [
            {
                title: '用户管理',
                componentName: 'userManage',
                isShow: true,
                icon: 'el-icon-s-custom',
                authority:[
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                    ]
            },
            {
                title: '管理员管理',
                icon: 'el-icon-menu',
                children: [
                    {
                      title: '权限分配', 
                      componentName: 'permission',
                      isShow: true, 
                      authority: [
                          {"id": 3,"saDisplayName": "用户筛选","checked": true},
                          {"id": 3,"saDisplayName": "用户添加","checked": true},
                          {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                    {
                      title: '角色管理',
                      componentName: 'roleManage',
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                    {
                      title: '日志查询',
                      componentName: 'logQuery',
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                ]  
            },
            {
                title: '路线管理',
                icon: 'el-icon-share',
                children: [
                    {
                      title: '站点管理', 
                      componentName: 'station', 
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                    {
                      title: '路线绑定',
                      componentName: 'routeBinding',
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                    {
                      title: '历史轨迹',
                      componentName: 'historicalTrack',
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                ]  
            },
            {
                title: '校车管理',
                icon: 'el-icon-s-flag',
                children: [
                    {
                      title: '校车管理', 
                      componentName: 'busManage', 
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                    {
                      title: '校车绑定', 
                      componentName: 'busBinding', 
                      isShow: true,
                      authority: [
                        {"id": 3,"saDisplayName": "用户筛选","checked": true},
                        {"id": 3,"saDisplayName": "用户添加","checked": true},
                        {"id": 3,"saDisplayName": "权限重载","checked": true},
                      ]
                    },
                ]  
            }
        ]
        this.$store.dispatch('setAuthority',authority);
        //保存到data中
        this.menuItems = authority;
      }
    }
}
</script>

<style lang="less" scoped>
@headerHeight: 45px;
@footerHeight: 45px;
@containerHegiht: calc(~"100% - @{headerHeight} - @{footerHeight}");
@asideWidth: 220px;
#index {
  width: 100%;
  height: 100%;
  .header {
    padding: 0;
    height: @headerHeight !important;
  }
  .container {
    position: relative;
    .aside {
      width: @asideWidth !important;
      height: 100%;
    }
    .main {
      padding: 0;
    }
  }
  .footer {
    height: @footerHeight !important;
    line-height: @footerHeight !important;
    background: #222;
    p {
      color: #fff;
      text-align: center;
    }
  }
}
</style>
