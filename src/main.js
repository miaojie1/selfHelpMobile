// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import HttpUtil from './common/HttpUtil'
import store from './store'
import pinyin from './common/pinyin'
// import pinyin from 'pinyin-match'
Vue.config.productionTip = false
// Vue.use(pinyin)
Vue.use(MintUI)
Vue.prototype.$http = HttpUtil
Vue.prototype.$pinyin = pinyin
/* eslint-disable no-new */
new Vue({
  base: '/selfHelpVue',
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
// 利用vue-router进行跳转是，页面滚动条自动回滚到顶部
router.afterEach((to, from, next) => {
  // 跳转时，调到的页面的坐标位置
  window.scrollTo(0, 0)
})
