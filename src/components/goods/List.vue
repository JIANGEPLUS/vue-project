<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable  v-model="queryInfo.query" @clear="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="goodsAdd">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="goodsList"
        style="width: 100%"
        border
        stripe>
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格"
          width="80">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="60">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="100">
          <!--对时间使用dayjs插件进行格式化 -->
          <template slot-scope="scope">
                {{dayjs(scope.row.add_time).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button  type="primary" icon="el-icon-edit" size="mini" @click="editGoodsButton(scope.row)"></el-button>
            <el-button  type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsButton(scope.row)"></el-button>            
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页模块 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="this.queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total">
        </el-pagination>
      </div>
    </el-card>


      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑分类"  :visible.sync="editGoodsDialogVisible" width="50%">
        <el-form :model="editgoodsForm"  ref="editFormRef" :rules="editFormRules" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editgoodsForm.goods_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassify">确 定</el-button>
        </div>
      </el-dialog>
  </div>

</template>

<script>
import { Scope } from 'eslint-scope'

export default {
  created () {
    this.getGoodsList()
    console.log(this)
  }, 
  data () {
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      goodsList:[],
      total:0,
      searchInput:'',
      editgoodsForm:{},
      editGoodsDialogVisible:false,
      editFormRules:{},
      
    }
  },
  methods: {
    async getGoodsList(){
      const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
      if(res.meta.status!==200)
      {
        this.$message.error(res.meta.msg)
      }
      this.goodsList=res.data.goods
      this.total=res.data.total
      console.log(this.goodsList)
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getGoodsList()
    },
    searchGoods(){
      this.getGoodsList()
    },
    editGoodsButton(row){
      this.editgoodsForm.goods_name=row.goods_name
      this.editGoodsDialogVisible=true
    },
    async deleteGoodsButton(row){
      const{data:res}=await this.$http.delete(`goods/${row.goods_id}`)
      if(res.meta.status!==200)
      {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    goodsAdd(){
      this.$router.push('/goods/add')
    },
    editClassify(){
      
    }
  }

}
</script>

<style lang="less" scoped>
.box-card{
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
</style>