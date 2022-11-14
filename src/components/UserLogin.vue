<template>
  <div class="main">
    <div class="login">
      <div class="logo_img">
        <img src="@/assets/logo.png">
      </div>
      <el-form  :model="form"  ref="LoginForm" :rules="rules" label-width="70px" class="LoginForm">
        <el-form-item  label="账号:" prop="username" >
          <el-input v-model="form.username" prefix-icon="el-icon-s-custom" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item  label="密码:" prop="password" >
          <el-input v-model="form.password" show-password prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-row class="buttonFrom">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-row>

      </el-form>      
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form:{
        username:'',
        password:''
      },
      rules: {
          username:[
            {required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitForm(){
        this.$refs.LoginForm.validate(async(vaild)=>{
          if(vaild) {
        const {data:res} =await this.$http.post('login',this.form)
        console.log(res)
        if(res.meta.status!=200){
          this.$message({
          message: '登录出现问题',
          type: 'warning'
          })
          return  
        }
        this.$message({
        message: '恭喜你，登录成功',
        type: 'success'
        })
        sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
        }
          else{
          this.$message({
          message: '登录失败',
          type: 'warning'
          })
        }
      }
      )
      },
      reset(){
        this.$refs.LoginForm.resetFields()
      } 
    }
  }
</script>

<style lang="less" scoped>
.main{
  width: 100%;
  height: 100%
}
.login{
  position: absolute;
  width: 400px;
  height: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid;
  .logo_img{
    position: absolute;
    width: 130px;
    height: 130px;
    left: 50%; 
    img{
    width:100%;
    height: 100%;
    border-radius: 50%;
    transform: translate(-50%,-50%);
  }
  }
  .LoginForm{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .buttonFrom{
    display: flex;
    justify-content: flex-end;
  }
}
</style>>
