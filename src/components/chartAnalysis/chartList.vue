<template>
  <div>
    <mt-header :title="title" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="chart-container">
      <div class="chart-item">
        <img src="@/assets/zaigang.png" @click="handleChart('在岗员工构成', 'H_YGXS')">
        <span>在岗员工构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/ligang.png" @click="handleChart('离岗人员构成', 'H_YDSJ')">
        <span>离岗人员构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/guanli.png" @click="handleChart('管理人员构成', 'H_ZJ')">
        <span>管理人员构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/age.png" @click="handleChart('年龄构成', 'H_AGE')">
        <span>年龄构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/zhuanye.png" @click="handleChart('专业技术资格构成', 'H_ZYJSZWZG')">
        <span>专业技术资格构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/xueli.png" @click="handleChart('学历构成', 'H_XL')">
        <span>学历构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/pinyong.png" @click="handleChart('聘用专业技术职务构成', 'H_PRZYJSZW')">
        <span>聘用专业技术职务构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/zhiye.png" @click="handleChart('职业技能等级构成', 'H_ZYJNDJ')">
        <span>职业技能等级构成</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      backUrl: '',
      title: '',
      time: ''
    }
  },
  created: function () {
    this.title = this.$store.getters.chartTitle
    this.backUrl = '/chartAnalysis?userName=' + window.localStorage.getItem('empNum')
    let date = new Date()
    this.time = date.getFullYear()
    this.$store.dispatch('modifyTime', this.time)
  },
  methods: {
    handleChart (val, key) {
      this.$store.dispatch('modifyChartType', val)
      this.$store.dispatch('modifyChartTypeKey', key)
      this.$router.push({
        path: '/showChart'
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
    width: 43%;
  }
  span {
    display: block;
    margin-top: 5pt;
    font-size: 13pt;
  }
}
</style>
