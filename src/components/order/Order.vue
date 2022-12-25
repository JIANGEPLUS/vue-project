<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input v-model="searinput" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>    
      </el-row>

      <!-- 表格 -->
      <template>
        <el-table
          :data="orderList"
          border
          stripe
          style="width: 100%;margin-top:20px">
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号">
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格"
            width="80">
          </el-table-column>
          <el-table-column
            prop="order_pay"
            label="是否付款"
            width="80">
            <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay==1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>              
            </template>
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货"
            width="80">
          </el-table-column>
          <el-table-column
            prop="order_pay"
            label="下单时间">
            <template slot-scope="scope">
              {{dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
              <el-tooltip class="item" effect="light" content="修改订单地址" placement="bottom">
                <el-button type="primary" icon="el-icon-edit" @click="editButton"></el-button>
              </el-tooltip>
              
              <el-button type="success" icon="el-icon-location-outline" @click="kuaidiButton"></el-button>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页模块 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 编辑地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editdialogVisible"
      width="30%"
      @close="handleClose">
      <el-form ref="editformRef" :model="editform" label-width="80px" :rules="editFromRule">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editform.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editform.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsdialogVisible"
      width="30%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in kuaidi.data"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logisticsdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入cityData地址数据
import cityData from './citydata.js'
import kuaidi from './kuaidi.js'
export default {
  created () {
    
    this.getOrderList()
  },
  data () {
    return {
      searinput:'',
      orderList:[],
      total:0,
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      editform:{

      },
      city:[],
      cityData,
      kuaidi,
      editdialogVisible:false,
      logisticsdialogVisible:false,
      editFromRule:{

      },
      editFromRule:{
        address1:[{ required: true, message: '请选择省市区县', trigger: 'blur'}],
        address2:[{required: true, message: '请输入详细地址', trigger: 'blur'}]
      }
    }
  },
  methods: {
    async getOrderList(){
      const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
      if(res.meta.status!==200){
        this.$message.error(res.meta.msg)
      }
      this.orderList=res.data.goods
      this.total=res.data.total
      console.log(res)
    },
    handleSizeChange(newSize){
    this.queryInfo.pagesize=newSize
    this.getOrderList()

    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getOrderList()
    },
    editButton(){
      this.editdialogVisible=true
      
    },
    handleClose(){
      this.$refs.editformRef.resetFields()
    },
    kuaidiButton(){
      this.logisticsdialogVisible=true
    }
  },

}
</script>

<style lang="less" scoped>
.box-card{
  margin-top: 20px;
}
</style>

