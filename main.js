import Vue from 'vue'
import App from './src/App.vue'
import router from './src/router'
import './src/plugins/element.js'
import '@/plugins/element'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
