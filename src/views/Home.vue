<template>
  <div id="home">
    <div class="container">
        <h1 class="title">欢迎登陆</h1>
        <p class="lead"> GPS校车定位管理系统! </p>
    </div>
  </div>
</template>

<script>

export default {
    name: 'home',
}
</script>

<style lang="less" scoped>
#home {
  width: 100%;
  min-height: calc(~"100vh -  131px");  
  background-color: red;
  background: url(./../assets/showcase.png) no-repeat;
  background-size: cover;
  .container {
    width: 100%;
    min-height: calc(~"100vh -  131px");
    box-sizing: border-box;
    padding-top: 100px;
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    color: #fff;
    .title {
        font-size: 30px;
    }
    .lead {
        margin-top: 50px;
        font-size: 22px;
    }
  }
}
</style>
