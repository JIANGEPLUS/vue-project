<template>
  <div>
    <el-button type="primary" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
      console.log(1111)
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>