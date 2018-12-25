<template>
  <div>
    <mt-header title="图表分析" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="chart-container">
      <div class="chart-item" @click="handleChart('人员')">
        <img src="@/assets/crenyuan.png">
        <span>人员比例</span>
      </div>
      <div class="chart-item" @click="handleChart('薪资')">
        <img src="@/assets/cxinzi.png">
        <span>薪资比例</span>
      </div>
      <div class="chart-item" @click="handleChart('学历')">
        <img src="@/assets/a20.png">
        <span>学历比例</span>
      </div>
      <div class="chart-item" @click="handleChart('性别')">
        <img src="@/assets/crenyuan.png">
        <span>性别比例</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      backUrl: ''
    }
  },
  created: function () {
    this.backUrl = '/chartAnalysis'
  },
  methods: {
    handleChart (val) {
      this.$router.push({
        path: '/showChart',
        query: {
          chartTitle: val
        }
      })
    }
  }
}
</script>
<style lang="less">
.chart-container {
  width: 100%;
  margin: 0 auto;
  margin-top: 70pt;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: start;
}
.chart-item {
  width: 50%;
  height: 10%;
  display: flex;
  flex-flow: column;
  margin-bottom: 20pt;
  img {
    margin: 0 auto;
    width: 50%;
  }
  span {
    display: block;
    margin-top: 5pt;
    font-size: 12pt;
  }
}
</style>
