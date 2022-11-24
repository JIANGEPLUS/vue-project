<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 利用布局比例分配输入框与按钮的位置 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 把输入框数值存入queryInfo中的query，然后调用get请求对应的数值，然后清空 -->
          <el-input placeholder="请输入内容"  clearable @clear="getUserList" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogForm=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格内容 -->
      <template>
        <el-table 
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="100"> </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="100">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
            width="100">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
            width="100">
          </el-table-column>
          <el-table-column
            prop="mg_state"
            label="状态"
            width="100">
            <template v-slot:default="scope">
              <el-switch v-model ="scope.row.mg_state" @change="putUserState(scope.row)">
              </el-switch>
            </template>

          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template v-slot:default="scope">
              <!-- 分别是修改、删除、分配角色三个按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editDialog(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="distributeRoles(scope.row)"></el-button>
              </el-tooltip>
            </template> 
          </el-table-column>

        </el-table>
      </template>

      <!-- 分页模块 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- 添加用户表单模块 -->
      <el-dialog title="添加用户"  :visible.sync="addDialogForm" @close="addDialogClosed">
        <el-form :model="addForm"  ref="addFormRef" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogForm = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户信息模块 -->
      <el-dialog title="修改用户信息"  :visible.sync="editDialogForm" @close="editDialogClosed">
        <el-form :model="editForm"  ref="editFormRef" :rules="addFormRules">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogForm = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
          <div>
          <p>当前的用户:{{userInfo.username}}</p>
          <p>当前的角色:{{userInfo.role_name}}</p>
          <p>分配新角色:
              <!-- 角色选择下拉框
              v-model：设置用户选中角色之后的id绑定数据
              -->
              <el-select v-model="selectedRoleId" placeholder="请选择角色">
              <!-- :label 显示文本，:value 选中值 -->
              <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
              </el-option>
              </el-select>
          </p>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo(userInfo.id)">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { Scope } from 'eslint-scope'

export default {
  created () {
    this.getUserList()
    this.getRolesList()
  },
  data() {
    var checkEmail = (rule, value, callback) => {
        const regEmail=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (regEmail.test(value))
        {
          return callback()
        }
        return callback('请输入合法的邮箱')
      }
    var checkMobile = (rule, value, callback) => {
      const regMobile=/^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regMobile.test(value))
      {
        return callback()
      }
      return callback('请输入合法的手机')
    };
      
      return {
        tableData:[],
        // params要传的数值
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 4
          },
          // 总记录数
        total:0,
        stateSwitch:'',
        addDialogForm:false,
        addForm:{},
        addFormRules:{
          username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 使用自定义规则检验邮箱格式
          { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
          ],
          mobile:[
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator:checkMobile, message: '手机格式不正确，请重新输入', trigger: 'blur'}
          ]

        },
        editDialogForm:false,
        editForm:{
          username:'',
          id:'',
          mobile:'',
          email:''
        },
        setRoleDialogVisible:false,
        userInfo:{},
        selectedRoleId:'',
        rolesList:{}
      }
    },
    methods: {
      async getUserList(){
      const {data:res} = await this.$http.get('users',{
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      //如果返回状态正常，将请求的数据保存在data中
      this.tableData = res.data.users;
      this.total = res.data.total;
      },
      // 状态发生改变时，把改变后的状态发送到服务器保存,user存储当前行的信息
      async putUserState(user){
        const {data:res} =await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        if(res.meta.status!=200)
        {
          return this.$message.error(res.meta.msg)
        }
        this.$message(res.meta.msg)
      },
      // 改每页大小
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        //重新按照pagesize发送请求，请求最新的数据
        this.getUserList()
      },
      // 换页码时候获取对应页码的数值
      handleCurrentChange(newCurrent){
        this.queryInfo.pagenum=newCurrent
        //重新按照pagenum发送请求，请求最新的数据
        this.getUserList()
      },
      // 关闭对话框时清除所填写内容
      addDialogClosed(){
        this.$refs.addFormRef.resetFields() 
      },
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return this.$message.error("请填写完整用户信息")
          // 发送添加用户的请求
          const {data:res}=await this.$http.post('users',this.addForm)
          if(res.meta.status!=201)
          {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.addDialogForm=false
          // 程序获取最新数据
          this.getUserList()
        })
      },
      // 通过scope传这一行的值进来，获取某id的数据
      async editDialog(row){
        this.editDialogForm=true
        const {data:res}=await this.$http.get('users/'+row.id)
        console.log(res)
        if(res.meta.status!=200){
          return this.$message.error(res.meta.msg)
        }
        this.editForm=res.data
      },
      // 把修改的数据提交服务器
      async editDialogClosed(){

        // const {data:res}=await this.$http.put('users/'+this.editForm.id)
        // console.log(res)
        // if(res.meta.status!=200)
        // {
        //   return this.$message.error(res.meta.msg)
        // }
        // this.$message.success(res.meta.msg)
        // this.getUserList()
        // this.editDialogForm=false
        this.$refs.editFormRef.resetFields()
      },
      editUser(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return this.$message.error("请填写完整用户信息")
          // 发送添加用户的请求
          const {data:res}=await this.$http.put('users/'+this.editForm.id,this.editForm)
            console.log(res)
          if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.editDialogForm=false
          // 程序获取最新数据
          this.getUserList()
        })
      },
      async deleteUser(id){
        const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirmResult)
        if(confirmResult=='cancel'){
          return this.$message.info("已经取消删除")
        }
        const {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getUserList()
      },
      distributeRoles(role){
        this.userInfo=role
        this.setRoleDialogVisible=true
      },
      // 发送分配角色的请求
      async saveRoleInfo(id){
        const {data:res}=await this.$http.put(`users/${id}/role`,{rid:this.selectedRoleId})
        if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getUserList()
          this.setRoleDialogVisible=false
      },
      async getRolesList(){
        const {data:res}=await this.$http.get('roles')
        if(res.meta.status!=200)
          {
            return this.$message.error(res.meta.msg)
          }
        this.rolesList=res.data
      },
      setRoleDialogClosed(){
      //当关闭对话框的时候，重置下拉框中的内容
      this.selectedRoleId = ''
      this.userInfo = {} 
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
</style>>
