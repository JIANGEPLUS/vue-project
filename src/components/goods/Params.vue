<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区域 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>

      <el-row type="flex" class="cat_opt">
        <el-col :span="2" >
          <span class="row_span">选择商品分类:</span>
        </el-col>
        <el-col :span="6">
          <!--级联选择框 -->
          <div class="block">
            <el-cascader
              v-model="selectedKeys"
              :options="cateList"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
          </div>
        </el-col>
      </el-row>

      <!-- 属性标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="only"></el-tab-pane>
        <el-tab-pane label="静态属性" name="many"></el-tab-pane>
      </el-tabs>

      <!-- 添加参数 -->
      <el-button type="primary" class="addButton" :disabled="isAddButton" @click="addFormDialog">添加参数</el-button>
   

            <!-- 表格区域 -->
      <el-table
        :data="attrList"
        border
        stripe
        style="width: 100%"
        >
        <!--扩展行 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-tag            
              v-for="(item,i) in scope.row.attr_vals"
              :key="i"
              closable
              :disable-transitions="false"
              @close="handleClose(i,scope.row)">
              {{item}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="#"
          type="index">
        </el-table-column>
        <el-table-column
          prop="attr_name"
          label="参数名称">
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editFormDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteFormDialog(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

        <!-- 添加属性对话框 -->
      <el-dialog :title="'添加'+addTile"  :visible.sync="addDialogVisible" width="30%">
        <el-form :model="addForm"  ref="addFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item :label="addTile" prop="attr_name">
            <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addClassify">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑属性对话框 -->
      <el-dialog :title="'编辑'+addTile"  :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editForm"  ref="editFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item :label="addTile" prop="attr_name">
            <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
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
      // 商品列表
      cateList:[],
      // 参数列表
      attrList:[],
      // // 动态参数列表
      // onlyList:[],
      // // 静态参数列表
      // manyList:[],
      //用户在级联下拉菜单中选中的分类id
      selectedKeys:[],
      // 级联选择器的props配置设置
      cascaderProps:{
        // 选择的值
        value:'cat_id',
        // 选择所看到的
        label:'cat_name',
        // 子节点
        children:'children',
        // 选择方式
        expandTrigger:'hover',
        checkStrictly:true,
      },
        //对话框可视化
        addDialogVisible:false,
        editDialogVisible:false,
        // 输入框可视化
        addForm:{},
        editForm:{},
        inputValue:'',
        // 标签现在的值
        activeName:'only',
        // 添加对话框的规则
        addFormRules:{
        attr_name:[ {required:true , message:'请输入添加参数',trigger:'blur'} ]
      },
      c_id:''
    }
  },
  methods: {
    async getCateList(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
     this.cateList=res.data
    },
    // 如果选择的不是三级商品，则需要重新选择
    handleChange(){
      if(this.selectedKeys.length!==3){
        this.attrList=[]
        this.selectedKeys=[]
        return 
      }else{
        this.c_id=this.selectedKeys[2]
      }
      this.getAttrList()
    },
    // 切换参数列表
    handleClick(){
      this.getAttrList()
    },
    async getAttrList(){
      const {data:res}=await this.$http.get(`categories/${this.c_id}/attributes`,{ params: { sel: this.activeName } })
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      // 遍历属性列表，把属性变成数组形式
      res.data.forEach(element => {
        if(!element.attr_vals){
          element.attr_vals=[]

        }else{
          element.attr_vals=element.attr_vals.split(" ")
        }
        // 给每个属性增加输入框的判断和内容
        element.inputVisible=false
        element.inputValue=''
      });
      console.log(res.data)
     this.attrList=res.data
    },
    // 提交添加参数的请求
    async addClassify(){
      console.log(this.c_id,this.addForm.attr_name,this.activeName)
      const {data:res}=await this.$http.post(`categories/${this.c_id}/attributes`,
      {attr_name:this.addForm.attr_name,
        attr_sel:this.activeName,
        attr_vals: "a,b,c"
      })
      
      if(res.meta.status!=201){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAttrList()
      this.addDialogVisible=false
    },
    // 添加参数事件，打开对话框
    addFormDialog(){
      this.addDialogVisible=true
    },
    // 获取编辑行的名称信息
    async editFormDialog(id){
      const {data:res}=await this.$http.get(`categories/${this.c_id}/attributes/${id}`,{ params: { attr_sel: this.activeName } })
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    // 提交修改请求
    async editClassify(){
      const {data:res}=await this.$http.put(`categories/${this.c_id}/attributes/${this.editForm.attr_id}`,{ params: this.editForm })
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAttrList()
      this.editDialogVisible=false
    },
    // 提交删除的请求
    async deleteFormDialog(id){
      // 删除确认
      const confirm=await this.$confirm('此操作将永久删除该'+this.addTile, '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err=>err)
      
    if(confirm!='confirm'){
        return this.$message.info('已经取消删除')
      }
      const {data:res}=await this.$http.delete(`categories/${this.c_id}/attributes/${id}`)
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getAttrList()
    },
    handleClose(i,row){
      //删除对应索引的参数可选项
      row.attr_vals.splice(i,1)
      //调用函数，完成保存可选项的操作
      this.saveAttrVals(row)
    },
    showInput(row){
      row.inputVisible=true
      // 在渲染输入框完成后，让输入框获取焦点
      this.$nextTick(_=>{
        this.$refs.saveTagInput.focus()
        // console.log()
      }) 
    },
    // 失去焦点和回车时添加新标签和恢复添加标签按钮
    async handleInputConfirm(row){
      if(row.inputValue.trim().length===0){
        row.inputVisible=false
        row.inputValue=''
        return
      }
      console.log(row.attr_vals)
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=''
      row.inputVisible=false
      // 如果非空则提交参数
      this.saveAttrVals(row)
    },
    async saveAttrVals(row){
      const {data:res}=await this.$http.put(`categories/${this.c_id}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    addTile(){
      if(this.activeName=='only'){
        return '动态参数'
      }
      else{
        return '静态属性'
      }
    },
    isAddButton(){
      if(this.selectedKeys.length==3){
        return false
      }else{
        return true
      }
    }
  }

}
</script>

<style lang="less" scoped>
.box-card{
  margin-top: 20px;
}
.cat_opt{
margin: 20px 0;
}
.row_span{
  float: left;
  line-height: 40px;
}
.addButton{
  float: left;
  margin-bottom: 15px;
}
.block{
  float: left;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>