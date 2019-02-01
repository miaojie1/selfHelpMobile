<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      data: 'test'
    }
  },
  created: function () {
    this.checkMobile()
  },
  beforeRouteLeave (to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = true
    next()
  },
  methods: {
    // 判断当前机型
    checkMobile () {
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        window.localStorage.setItem('mobileType', 'isAn')
      }
      if (isIOS) {
        window.localStorage.setItem('mobileType', 'isIos')
      }
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
