<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域 -->
    <el-card class="box-card">
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//导入echarts
import * as echarts from 'echarts'
//导入lodash
import _ from 'lodash'
export default {
data () {
  return {
    options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
  }
},
created () {
  
},
async mounted () {    
    //在页面dom元素加载完毕之后执行的钩子函数mounted
    // 基于准备好的dom，初始化echarts实例
    console.log(echarts)
    var myChart = echarts.init(document.getElementById('main'))
    //准备数据和配置项
    //发送请求获取折线图数据
    const{data:res}=await this.$http.get('reports/type/1')
    if(res.meta.status!==200)
    {
      this.$message.error(res.meta.msg)
    }
    console.log(res)
    //合并res.data和this.options
    const result=_.merge(res.data,this.options)

    // 使用获取的数据展示图表
    myChart.setOption(result)
  },
  methods: {

  } 
}

</script>

<style>

</style>