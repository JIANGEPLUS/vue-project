<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="1" class="addButton">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 主题表格区域 -->
      <template>
        <tree-table :data="CateList" :columns="columns" :selection-type="false"
        :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 剩余排列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button> 
        </template>
        </tree-table>



        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </template>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"  :visible.sync="addCateDialogVisible" @close="addDialogClosed" width="50%">
        <el-form :model="addClassifyForm"  ref="addFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addClassifyForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父类" prop="cat_pid">
            <!-- 父类级联选择器 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCate"
              :props="cascaderProps"
              @change="parentCateChange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClassify">确 定</el-button>
        </div>
      </el-dialog>


      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑分类"  :visible.sync="editCateDialogVisible" width="50%">
        <el-form :model="editClassifyForm"  ref="editFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editClassifyForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassify">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  
  created () {
    this.getCateList()
  },
  data () {
    return {
      CateList:[],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total:0,
      // 一级标题列
      columns: [
        {label:'分类名称',prop:'cat_name'},
        //type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        {label:'是否有效',prop:'',type:'template',template:'isok'},
        {label:'排序',prop:'',type:'template',template:'order'},
        {label:'操作',prop:'',type:'template',template:'opt'}
      ],
      // 添加分类的的元素
      addClassifyForm:{
        //分类名称
        cat_name:'',
        //添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid:0,
        //添加分类的等级，0则表示添加一级分类
        cat_level:0
      },
      editClassifyForm:{

      },
      // 添加对话框的是否可视化
      addCateDialogVisible:false,
      editCateDialogVisible:false,
      // 添加分类的表单规则
      addFormRules:{
        cat_name:[ {required:true , message:'请输入分类名称',trigger:'blur'} ]
      },
      // 父类列表
      parentCate:[],
      // 级联选择器选中的内容
      selectedKeys:[0],
      // 级联选择显示配置
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger:'hover',
        checkStrictly:true
      },
      //父类id
      // 添加分类表单
      postCateFrom:{
        cat_pid:0

      }
      
    }
  },
  methods: {
    async getCateList(){
      const {data:res}=await this.$http.get('categories',{params:this.queryInfo})
      if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     this.CateList=res.data.result
     this.total=res.data.total
     console.log(this.CateList)
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      //重新按照pagesize发送请求，请求最新的数据
      this.getCateList()
    },
    // 换页码时候获取对应页码的数值
    handleCurrentChange(newCurrent){
      this.queryInfo.pagenum=newCurrent
      //重新按照pagenum发送请求，请求最新的数据
      this.getCateList()
    },
    // 点击添加分类按钮事件
    showAddCateDialog(){
      this.getParentCate()
      this.addCateDialogVisible=true
    },
    //获取父类的分类数据列表
    async getParentCate(){
      const {data:res}=await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     this.parentCate=res.data
     console.log(this.parentCate)

    },
    // 关闭对话框时候清空内容
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
      // this.$refs.addFormRef
    },
    // 提交添加分类请求
    async addClassify(){
      //当用户点击对话框中的确定时，校验表单
    this.$refs.addFormRef.validate(async valid => {
      //校验不通过，return
      if (!valid) return
      //校验通过，发送请求完成添加参数或者属性
      const {data:res}= await this.$http.post('categories',this.addClassifyForm)
  
     if(res.meta.status!=201){
      return this.$message.error(res.meta.msg)
     }
     this.$message.success(res.meta.msg)
     this.getCateList()
     this.addCateDialogVisible=false
    })
    },
    // 父类级联选择器变化函数
    parentCateChange(){
      this.addClassifyForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
      this.addClassifyForm.cat_level=this.selectedKeys.length
    },
    // 弹出修改对话框，同时获取对应id的数据
    async editDialog(roles){
      const {data:res}= await this.$http.get(`categories/+${roles.cat_id}`)
      if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     this.editClassifyForm=res.data
     this.editCateDialogVisible=true
    },
    // 提交修改的数据
    editClassify(){
      this.$refs.editFormRef.validate(async valid => {
      //校验不通过，return
      if (!valid) return
      const {data:res}=await this.$http.put(`categories/+${this.editClassifyForm.cat_id}`,this.editClassifyForm)
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.editCateDialogVisible=false
      })
    },
    async deleteCate(roles){
      const {data:res}=await this.$http.delete(`categories/+${roles.cat_id}`)
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.box-card{
  margin-top: 20px;
}
.addButton{
  margin-bottom: 20px;
}
.el-cascader{
  width: 100%;
}
</style>
