import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import VCharts from 'v-charts'
import { getStore} from './utils/storage'
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  // loading: require('img/loading.png'),//加载中图片，一定要有，不然会一直重复加载占位图
  // error: require('img/error.png')  //加载失败图片
});
Vue.use(VCharts)
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
// axios.defaults.baseURL = "http://119.3.104.39:2302/api/"
Vue.config.productionTip = false
axios.defaults.withCredentials = true
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    // 对路由进行验证     
    if (getStore('type')=='super') { // 已经登陆  
      next();  // 正常跳转到你设置好的页面    
    }
    else {
      next({
        path: '/first'
      })
    }
  }else {
    next()
    
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
