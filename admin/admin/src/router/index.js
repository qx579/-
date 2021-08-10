import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import NoticePage from '../views/NoticePage.vue'
// import InfoPage from '../views/InfoPage.vue'
import CarsPage from '../views/CarsPage.vue'
import Detail from '../views/Detail.vue'
import Home from '../components/Home.vue'
import finish from '../views/finish.vue'
import first from '../views/first.vue'
import deleteCar from '../views/delete.vue'
import image from '../views/image.vue'
import addimage from '../views/addimage.vue'
import suggest from '../views/suggest.vue'
import user from '../views/user.vue'
Vue.use(VueRouter)

const routes = [
  {path:"/",redirect:"/login"},
  {path:"/login",component:Login},
  
  {path:"/Home",component:Home,
  children:[
    {path:"/Notice",component:NoticePage,meta:{auth:true}},
    {path:"/Cars",component:CarsPage},
    {path:"/Detail",name:'Detail',component:Detail},
    {path:"/finish",name:'finish',component:finish},
    {path:"/first",name:'finish',component:first},
    {path:"/deleteCar",name:'deleteCar',component:deleteCar},
    {path:"/image",name:'deleteCar',component:image,meta:{auth:true}},
    {path:"/addimage",name:'deleteCar',component:addimage,meta:{auth:true}},
    {path:"/suggest",name:'deleteCar',component:suggest,meta:{auth:true}},
    {path:"/user",name:'user',component:user,meta:{auth:true}},
]
},
  
]


const router = new VueRouter({
  routes
})

export default router
