<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 权限管理的表格 -->
      <template>
        <el-table
          :data="RightsList"
          border
          style="width: 100%">
          <el-table-column
          type="index"
          label="#">
          </el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径"
            width="180">
          </el-table-column>
          <el-table-column
            prop="level"
            label="权限等级">
            <!-- 使用插槽slot中的默认传每行的值 -->
            <template v-slot:default="scope">
              <el-tag v-if="scope.row.level==0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
            <!-- 根据level 用if判断 -->
          </el-table-column>
        </el-table>
      </template>
          </el-card>
        </div>
      </template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  data () {
    return {
      RightsList:[]
    }
  },methods: {
    async getRightsList(){
     const {data:res}=await this.$http.get('rights/list')
     if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     this.RightsList=res.data
     console.log(this.RightsList)
    }
  }
}
</script>

<style lang="less" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
    margin-top: 20px;
  }
</style>
