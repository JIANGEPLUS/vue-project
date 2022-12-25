import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/UserLogin.vue'
import Home from '@/components/ShopHome.vue'
import welcome from '@/components/Welcome.vue'
import users from '@/components/User/User.vue'
import rights from '@/components/power/Rights.vue'
import roles from '@/components/power/Roles.vue'
import cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import GoodList from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
import Order from '@/components/order/Order.vue'


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
    component:Home,
    redirect: '/welcome',
    // 带斜线的子路由会变成一级路由地址开始
    children:[
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      {path:'/rights',component:rights},
      {path:'/roles',component:roles},
      {path:'/categories',component:cate},
      {path:'/params',component:Params},
      {path:'/goods',component:GoodList},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order}
    ]
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
