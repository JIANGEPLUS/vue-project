<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

  <!-- 添加角色按钮 -->

  <!-- 角色列表表格 -->
    <el-card class="box-card">
      <template>
        <el-button type="primary" class="addButton" @click="addDialogForm=true">添加角色</el-button>
        <!-- 传入角色列表获取数据 -->
        <el-table
          :data="RolesList"
          :border="true"
          style="width: 100%">
          <!-- 展开行显示权限树状图 -->
          <el-table-column type="expand">
            <template v-slot:default="scope">
              <!-- 可用pre显示源格式数据 -->
              <!-- {{scope.row.children}} -->
              <el-row :gutter="20" v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['vcenter','bdbottom',index1===0?'bdtop':'']">
                <!-- for循环一级标签 -->
                <el-col :span="6"  class="tag_1">
                  <div>
                    <el-tag>{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </div>
                </el-col>
                <el-col :span="18">
                  <el-row :gutter="20" v-for="(item2,index2) in item1.children" :key="item2.id" :class="['vcenter',,index2!==0?'bdtop':'']">
                      <!-- for循环二级标签 -->
                      <el-col :span="6" >
                        <div>
                          <el-tag type="success">{{item2.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </div>
                      </el-col>
                      <el-col :span="18">
                        <!-- 第三级标签 -->
                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                      </el-col>              
                  </el-row>
                </el-col>              
            </el-row>
            </template>
          </el-table-column>
          <el-table-column
          type="index"
          label="#">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述"
            width="180">
          </el-table-column>
          <el-table-column           
            label="操作">
            <template v-slot:default="scope">
              <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" @click="distributeDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
          </el-card>


      <!-- 添加角色表单模块 -->
      <el-dialog title="添加角色"  :visible.sync="addDialogForm" @close="addDialogClosed">
        <el-form :model="addForm"  ref="addFormRef" :rules="addFormRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogForm = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑角色表单模块 -->
      <el-dialog title="编辑角色"  :visible.sync="editDialogForm" @close="editDialogClosed">
        <el-form :model="editForm"  ref="editFormRef" :rules="addFormRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogForm = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色表单模块 -->
      <el-dialog title="编辑角色"  :visible.sync="editDialogForm" @close="editDialogClosed">
        <el-form :model="editForm"  ref="editFormRef" :rules="addFormRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogForm = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </div>
      </el-dialog>


      <!-- 分配角色对话框模块 -->
      <el-dialog
        title="分配角色"
        :visible.sync="distributeDialogForm"
        width="50%"
        :before-close="distributClose"
        >
        <!-- 树形组件
        show-checkbox:显示复选框
        node-key:设置选中节点对应的值
        default-expand-all:是否默认展开所有节点
        :default-checked-keys 设置默认选中项的数组
        ref:设置引用 -->
        <el-tree ref="distributeTree" :default-checked-keys="defKeys" show-checkbox node-key="id" default-expand-all :data="distributeForm" :props="defaultProps"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogForm = false">取 消</el-button>
          <el-button type="primary" @click=postAllKeys>确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
created () {
  this.getRolesList()
},
data () {
  return {
    RolesList:[],
    addForm:{
      roleName:'',
      roleDesc:''
    },
    editForm:{},
    distributeForm:{},
    // 树形列表中的各级标题和子标题的数据绑定
    defaultProps:{
      children:'children',
      label:'authName'
    },
    // 树形列表中默认勾选的id
    roleId:'',
    defKeys:[],
    addDialogForm:false,
    editDialogForm:false,
    distributeDialogForm:false,
    addFormRules:{
      roleName:[
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
      ],
      roleDesc:[
      { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
      ]
    }
  }
},
methods: {
  //获取角色列表
  async getRolesList(){
     const {data:res}=await this.$http.get('roles')
     if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     this.RolesList=res.data
    },
    async removeRightById(role,id){
      // 删除权限的弹出确认框
      const confirmResult=await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

      //如果用户点击确认，则confirmResult 为'confirm'
      //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if(confirmResult != "confirm"){
          return this.$message.info("已经取消删除")
      }

      // 用户点击确定之后发出删除请求
      const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${id}`)
      // 利用浅拷贝找到本地存储的children进行替换，不用再发请求获取
      if(res.meta.status!==200)
      {
        return this.$message.error(res.meta.msg)
      }
      // 更新最新权限
      role.children=res.data
    },
    // 关闭时清空表单
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //发送添加角色请求
    async addRoles(){
    const {data:res}=await this.$http.post('roles',this.addForm)
    if(res.meta.status!==201)
    {
      return this.$message.error(res.meta.msg)
    }
    this.$message.success(res.meta.msg)
    //获取最新角色列表
    this.getRolesList()
    this.addDialogForm = false
    },
    //获取的目标行数据,显示在对话框
    async editDialog(roles){
    const {data:res}=await this.$http.get(`roles/${roles.id}`)
    console.log(res)
    if(res.meta.status!==200)
    {
      return this.$message.error(res.meta.msg)
    }
    //替换修改的数据表单
    this.editForm=res.data
    this.editDialogForm = true
    },
    // 判断是取消提交还是确认提交
    editDialogClosed(){
      
    },
    async editRoles(){
    // 使用修改的表单的数据发送角色数据
    const {data:res}=await this.$http.put(`'roles/'${roles.id}`,this.editForm)
    if(res.meta.status!==200)
    {
      return this.$message.error(res.meta.msg)
    }
    this.$message.success(res.meta.msg)
    this.editDialogForm=false
    },
    // 删除角色
    async deleteRoles(id){
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirmResult)
        if(confirmResult=='cancel'){
          return this.$message.info("已经取消删除")
        }
        // 如果确认删除，则从服务器删除掉对应角色
        const {data:res}=await this.$http.delete('roles/'+id)
        if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getRolesList()
    },
    // 分配角色视图
    async distributeDialog(role){
      // 把角色id保存下来给上传请求使用
      this.roleId=role.id
      // 先获取现有数据显示在树形控件
      const {data:res}=await this.$http.get(`rights/tree`)
      if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
      //获取所有权限列表的数据 
      this.getLeafKeys(role,this.defKeys)
      this.distributeForm=res.data
      this.distributeDialogForm=true
    },
    // 获取叶子节点的id
    // 递归每一个子节点
    getLeafKeys(node, arr) {
      //该函数会获取到当前角色的所有三级权限id并添加到defKeys中
      //如果当前节点不包含children属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      //递归调用
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 获得所有选中的节点的数组转换字符串，包括半选中、全选中,发送到服务器
    async postAllKeys(){
      const keys=[...this.$refs.distributeTree.getCheckedKeys(),...this.$refs.distributeTree.getHalfCheckedKeys()]
      const idstr=keys.join(',')
      // 修改服务器的角色权限
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
      console.log(res,idstr)
      if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.distributeDialogForm=false
    },
    // 关闭分配角色权限时清空id叶子节点存储列表
    distributClose(){
      this.defKeys=[]
    }
    
}
}
</script>

<style lang="less" scoped>
.addButton{
  float: left;
  margin-bottom: 20px;
}
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
  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .el-tag{
    margin: 7px;
  }

  .bdbottom{
    border-bottom: 1px solid gainsboro;
  }
  .bdtop{
    border-top: 1px solid gainsboro;
  }
  .vcenter{
    display:flex;
    align-items:center
  }
</style>
