<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import UserLogin from './components/UserLogin.vue';
export default {
  name: 'app',
  components: {
    UserLogin
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  /* 解决三级权限换行的问题 */
  min-width:1366px
}
</style>
