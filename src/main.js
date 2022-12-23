import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入lodash进行深拷贝
import _ from 'lodash'
import dayjs from 'dayjs'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.component('tree-table', TreeTable)
// Vue中导入富文本编辑器标签
Vue.use(VueQuillEditor, /* { default global options } */)

axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
Vue.config.productionTip = false
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http=axios
Vue.prototype.dayjs=dayjs

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
