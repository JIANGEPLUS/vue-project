import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/UserLogin.vue'
import Home from '@/components/ShopHome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // ...
  // 返回 false 以取消导航
  if(to.path==='/login')
  {
    return next()
  }else{
    const token=window.sessionStorage.getItem('token')
    if(!token){
      return next('/login')
    }
    next()
  }
  
})

export default router
