<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon>
      </el-alert>
      <el-steps :space="200" :active="activeName-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <el-form label-position="top" :rules="addFormRules" label-width="100px" :model="addForm" ref="addFromRef">
        <el-tabs :tab-position="'left'" v-model="activeName" @tab-click='tabClicked' :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0" >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                clearable
                :options="CateList"
                :props="goodsProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item  :label="item.attr_name" prop="goods_cat" v-for="item in manyAttriList" :key="item.attr_id">
              <el-checkbox-group v-model="checkList">
                <el-checkbox checked :label="arrt" v-for="(arrt,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item  :label="item.attr_name" :prop="item.attr_name" v-for="item in onlyAttriList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="removePicture"
              list-type="picture"
              :on-success="successPicture"
              :headers="headerObj">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-button type="primary" @click="uploadPicture" style="margin-top:20px">提交图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>            
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>


    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="picturePreviewVisible"
      width="30%"
      :before-close="handleClose">
      <el-image
      :src="picturePreviewPath"
      fit="fill"></el-image>
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
    activeName:'0',
    addForm:{
      goods_name:'',
      goods_price:0,
      goods_weight:0,
      goods_number:0,
      goods_cat:[],
      pics:[],
      goods_introduce:'',
      //商品属性和商品参数
      attrs:[]
    },
    // 上传图片服务器地址
    uploadURL:'https://lianghj.top:8888/api/private/v1/upload',
    // 设置图片上传请求头
    headerObj:{Authorization:window.sessionStorage.getItem("token")},
    addFormRules:{
      goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
    },
    goodsProps:{
      value:'cat_id',
      label:'cat_name',
      children:'children',
      expandTrigger:'hover'

    },
    CateList:[],
    manyAttriList:[],
    onlyAttriList:[],
    checkList:[],
    // 图片预览对话框
    picturePreviewVisible:false,
    picturePreviewPath:''
  }
},
methods: {
  async getCateList(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     this.CateList=res.data
    },
    async getAttriList(sel){
      const {data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:sel}})
      if(res.meta.status!=200){
      return this.$message.error(res.meta.msg)
     }
     if(sel=='many'){
      res.data.forEach(element => {
      element.attr_vals=element.attr_vals.length===0 ? []:element.attr_vals.split(' ')
     });
     this.manyAttriList=res.data
     console.log(this.manyAttriList)
     }else{
      this.onlyAttriList=res.data
     }
     
    },
    handleChange(){
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=[]
        return
      }
    },
    //再到methods编写事件函数beforeTabLeave
    beforeTabLeave(activeName,oldActiveName){
      //在tab栏切换之前触发，两个形参为切换前，后的tab栏name
      // if(oldActiveName === '0'){
      //     //在第一个标签页的时候
      //     if(this.addForm.goods_cat.length !== 3){
      //         this.$message.error('请选择商品的分类')
      //         return false
      //     }else if(this.addForm.goods_name.trim() === ''){
      //         this.$message.error('请输入商品名称')
      //         return false
      //     }else if(this.addForm.goods_price === 0){
      //         this.$message.error('请输入商品价格')
      //         return false
      //     }else if(this.addForm.goods_weight === 0){
      //         this.$message.error('请输入商品重量')
      //         return false
      //     }else if(this.addForm.goods_number === 0){
      //         this.$message.error('请输入商品数量')
      //         return false
      //     }
      // }
    },
    // 标签点击事件，获取activename来
    tabClicked(){
      if(this.activeName==='1'){
        this.getAttriList('many')
      }
      if(this.activeName==='2'){
        this.getAttriList('only')
      }
    },
    successPicture(response){
    //当上传成功时触发执行
    //形参response就是上传成功之后服务器返回的结果
    //将服务器返回的临时路径保存到addForm表单的pics数组中
    this.addForm.pics.push({ pic: response.data.tmp_path })
    console.log(this.addForm)
    },
    removePicture(file){
      // 删除时候删除addform里面的图片数组
      // 使用findIndex遍历找到相同path的序号，然后使用splice
      const index=this.addForm.pics.findIndex(item=>
        item.pic===(file.response.data.tmp_path)
      )
      this.addForm.pics.splice(index,1)
      console.log(this.addForm)
      
    },
    // 上传图片到服务器
    uploadPicture(){
      this.$http.post('upload',)
    },
    handlePreview(file){
      console.log(file)
      this.picturePreviewPath=file.response.data.url
      this.picturePreviewVisible=true
    },
    // 对话框关闭
    handleClose(){
      this.picturePreviewVisible=false
    },
    addGoods(){
      console.log(this.addForm.goods_introduce)
      this.$refs.addFromRef.validate(async valida=>{
        if(!valida){
          return this.$message.error('请正确填写表单')
        }else{
          //使用lodash深度克隆，因为v-model中要求为数组，变成字符串会报错
          const From=_.cloneDeep(this.addForm)
          From.goods_cat=this.addForm.goods_cat.join(',')
          
          // many动态参数添加到attrs
          this.manyAttriList.forEach(item=>{
            From.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals})
          })

          // only静态属性添加到attrs
          this.onlyAttriList.forEach(item=>{
            From.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals})
          })

          // 添加商品到服务器
          const {data:res}=await this.$http.post('goods',From)
          if (res.meta.status!=201){
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)

        }
      }
      
      )
    }
}
}
</script>

<style lang="less" scoped>
.box-card{
  margin-top: 20px;
}
.el-form--label-top {
text-align: left !important;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.btnAdd{
  margin-top: 20px;
}


</style>
