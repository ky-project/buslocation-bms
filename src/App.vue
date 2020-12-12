<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  created: function(){
    //如果有userMsg，保存到vuex中
    localStorage.getItem("userStore") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("userStore"))));
    
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload",()=>{
      localStorage.setItem("userStore",JSON.stringify(this.$store.state));
    })
  }
}
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
