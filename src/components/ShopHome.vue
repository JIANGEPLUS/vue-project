<template>
  <el-container class="home_container">
  <el-header class="home_header">
    <div>
      <img src="@/assets/heima.png" alt="">
      <span>后台管理系统</span>
    </div>
    <el-button type="primary" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <!-- 侧边栏菜单 -->
    <el-aside :width="isCollapse ? '64px':'200px' ">
      <div @click="toggleCollection" class="toggleButton">|||</div>   
      <!-- 开启路由模式，水平折叠，只保持一个展开 -->
      <el-menu
      router
      :collapse-transition="false"
      unique-opened
      :collapse="isCollapse"
      v-for="item in MenuList"
      :key="item.id"
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <!-- 一级菜单 -->
        <!-- index设置成路由网址 -->
        <el-submenu :index="'/'+item.path">
          <template slot="title">
            <i :class=iconList[item.id]></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <!-- index设置成路由网址 -->
          <el-menu-item @click="selectIndex" :index="'/'+item_son.path" v-for="item_son in item.children" :key="item_son.id">
            <template slot="title">
              <i class='el-icon-menu'></i>
              {{item_son.authName}} 
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  created () {
    this.getMenus()
  },
  data() {
    return {
      MenuList:null,
      iconList:{
        125:'el-icon-user-solid',
        103:'el-icon-s-help',
        101:'el-icon-s-goods',
        102:'el-icon-s-order',
        145:'el-icon-s-marketing'
      },
      isCollapse:false,
      activeIndex:''
    }
  },
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenus(){
    const {data:res} =await this.$http.get('menus')
    this.MenuList = res.data
    console.log(this.MenuList)
    },
    toggleCollection(){
      this.isCollapse=!this.isCollapse
    },
    selectIndex(){
      this.activeIndex=select.path
    }
  }
}
</script>

<style lang="less" scoped>
  .home_container{
  height: 100%;
  .home_header{
    display: flex;
    justify-content: space-between;
    background-color: gray;
    align-items: center;
    div{
      display: flex;
      align-items: center;
      color: #fff;
    }
  }
  .el-container{
    height: 100%;
  }
  .el-aside{
    overflow: hidden;
    background-color: skyblue;
    .toggleButton{
      background-color:#95a5a6;
      letter-spacing: 0.2em;
    }
  }
  .el-main{
    background-color: #ecf0f1;
  }
  }
</style>