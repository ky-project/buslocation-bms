<template>
  <div class="left-menu">
    <el-menu
      :unique-opened="true"
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#EEEEEE"
      text-color="#333"
      active-text-color="#ffd04b">
      <template v-for="(item,index) in items">
        <!-- 拥有子菜单 -->
        <el-submenu v-if="item.children" :index="index+''" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item 
            v-for="(child,index2) in item.children" 
            :index="index+'-'+index2" 
            :key="index+'-'+index2"
            @click="addTab(child)">
            {{child.title}}
          </el-menu-item>
        </el-submenu>
        <!-- 没有子菜单 -->
        <el-menu-item 
          v-else 
          :index="index+''" 
          :key="index"
          @click="addTab(item)">
          <i :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from './../busEvent';
export default {
    name: 'left-menu',
    data() {
      return {
        isCollapse: true,
      };
    },
    props: {
      items: Array,
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      addTab(item){
        bus.$emit('addTab',item);
      }
    }
}
</script>

<style lang="less">
@itemHeight: 40px;
.left-menu {
  height: calc(~"100vh -  90px");
  background-color: #eee;

  .el-submenu {
    border-top: 1px solid #e5e5e5;
    &:last-child {
      border-bottom: 1px solid #e5e5e5;
    }
  }


  .el-menu-item, .el-submenu__title {
    height: @itemHeight;
    line-height: @itemHeight;
  }

  .el-submenu .el-menu-item {
    height: @itemHeight;
    line-height: @itemHeight;
    border-top: 1px solid #e5e5e5;
    
    i {
      font-size: 12px;
    }
  }
}

</style>
