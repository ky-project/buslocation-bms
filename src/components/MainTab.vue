<template>
  <div id="main_tab">
    <el-tabs 
        v-model="activeName" 
        type="border-card" 
        closable
        @tab-remove="removeTab"
        @tab-click="tabClick">
        <el-tab-pane
            v-for="item in tabs"
            :label="item.title"
            :key="item.title"
            :name="item.title">
            <component v-if="item.isShow" :is="item.componentName"></component>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import bus from './../busEvent';
export default {
    name: 'main-tab',
    data() {
      return {
        activeName: '',
        tabs: [], // {title: '',componentName: '', authority: '', isShow= ''},
      }
    },
    methods: {
      removeTab(name){
        let needReload = false;
        //1.修改当前页
        if(this.activeName === name && this.tabs.length > 1){ //删除当前页
          needReload = true;
          //获取当前页索引
          let activeIndex = 0;
          this.tabs.find((item,index,array)=>{
            if(item.title === this.activeName){
              activeIndex = index;
              return true;
            }
          })
          //修改当前显示页
          let nextShow = activeIndex - 1; // 默认显示前一个页面
          if(activeIndex === 0){
            nextShow = 1;  //如果删除的是第一个，index = 1;
          }
          this.activeName = this.tabs[nextShow].title;
        }
        //2.删除页
        this.tabs.find((item,index,array)=>{
          if(item.title === name){
            array.splice(index,1);
            return true;
          }
        })
        //3.重载当前页
        // 如果activeName改变了，重载
        if(needReload){
          let item = this.getItemByTitle(this.activeName);
          this.reload(item);
        }
      },
      getItemByTitle(title){
        return this.tabs.find(item => title === item.title);
      },
      reload(item){
        // 使用v-if触发刷新
        item.isShow = false;
        this.$nextTick(function(){
          item.isShow = true;
        })
      },
      tabClick(tab){
        let item = this.tabs[parseInt(tab.index)];
        this.reload(item);
      }
    },
    mounted(){
      let self = this;
      bus.$on('addTab',function(item){
        //item=>{title: '',componentName: '', authority: []},
        let isExist = false;
        //0.判断是否存在
        self.tabs.find(obj=>{
          if(obj.title === item.title){
            isExist = true;
            return true;
          }
        })
        //1. 不存在添加组件
        if(!isExist){
          self.tabs.push(item);
        }
        //2. 存在且不是当前组件
        else if(isExist && item.title !== self.activeName){
          self.reload(item);
        }
        self.activeName = item.title; 
      })
    },
    components: {
      permission: () => import('./../views/manager/Permission.vue'),
      roleManage: () => import('./../views/manager/RoleManage.vue'),
      logQuery: () => import('./../views/manager/LogQuery.vue'),
      userManage: () => import('./../views/user/UserManage.vue'),
      personal: () => import('./../views/Personal.vue'),
      home: () => import('./../views/Home.vue'),
      station: () => import('./../views/path/Station.vue'),
      routeBinding: () => import('./../views/path/RouteBinding.vue'),
      historicalTrack: () => import('./../views/path/HistoricalTrack.vue'),
      busManage: () => import('./../views/bus/BusManage.vue'),
      busBinding: () => import('./../views/bus/BusBinding.vue'),
    }

}
</script>

<style lang="less">
#main_tab {
  .el-tabs--border-card>.el-tabs__content {
    padding: 0;
    // box-sizing: border-box;
  }

  .el-tabs--border-card>.el-tabs__header {
      background-color: #eee;
  }


  .el-tabs--border-card {
      box-shadow: none;
  }

  .el-tabs__content {
    box-sizing: border-box;
    height: calc(~"100vh - 45px - 41px - 45px");
    overflow-y: auto;
    overflow-x: hidden;
    // height: 500px;
  }
}

</style>
