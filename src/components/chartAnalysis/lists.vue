<template>
  <div>
    <mt-header :title="title" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="list-container">
      <div class="list-total" id="pieChart">
        {{titleSub}}：{{totalNum}}
      </div>
      <div class="list-detail-header">
        <div class="header-left">
          职工号
        </div>
        <div class="header-right">
          姓名
        </div>
      </div>
      <div class="list-data-container">
        <div class="list-detail-data">
          <mt-loadmore
            @top-status-change="handleTopChange"
            @bottom-status-change="handleBottomChange"
            :top-method="loadTop"
            :bottom-method="loadBottom"
            :distance-index="2"
            :auto-fill="allLoaded"
            :max-distance="150"
            ref="loadmoreList">
            <div class="list-detail-item" v-for="item in detailData" :key="item">
              <div class="detail-left">
                {{item.H_HU_BH}}
              </div>
              <div class="detail-right">
                {{item.H_HU_NAME}}
              </div>
            </div>
            <div slot="top" class="mint-loadmore-top">
              <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
              <span v-show="topStatus === 'loading'">
                <mt-spinner type="triple-bounce" color="#465295"></mt-spinner>
              </span>
            </div>
            <div slot="bottom" class="mint-loadmore-bottom">
              <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
              <span v-show="bottomStatus === 'loading'">
                <mt-spinner type="triple-bounce" color="#465295"></mt-spinner>
              </span>
            </div>
          </mt-loadmore>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      titleSub: '',
      backUrl: '/showChart',
      totalNum: '',
      bottomStatus: '',
      topStatus: '',
      code: '',
      allLoaded: false,
      detailData: [],
      page: 1,
      size: 10
    }
  },
  created: function () {
    this.title = this.$route.query.listTitle
    this.titleSub = this.$route.query.listTitleSub
    this.totalNum = this.$route.query.nums
    this.code = this.$route.query.code
    this.getDetail()
  },
  mounted: function () {
    // let myPie = echarts.init(document.getElementById('pieChart'))
    // let option = {
    //   data: {
    //     value: 20
    //   },
    //   tooltip: {
    //     trigger: 'item',
    //     formatter: '{a} <br/>{b} : {c} ({d}%)'
    //   },
    //   series: [{
    //     type: 'pie',
    //     radius: ['30%', '60%'],
    //     center: ['50%', '50%'],
    //     label: {
    //       normal: {
    //         show: true,
    //         formatter: '{b}:{c}'
    //       }
    //     },
    //     // 设置随机色
    //     color: function (value) {
    //       return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
    //     },
    //     animationType: 'scale',
    //     animationEasing: 'elasticOut',
    //     animationDelay: function (idx) {
    //       return Math.random() * 200
    //     }
    //   }]
    // }
    // myPie.setOption(option)
  },
  methods: {
    // 下拉方法
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadBottom () {
      let _this = this
      setTimeout(() => {
        _this.page++
        if (!this.allLoaded) {
          let url = '/statistics/getDetail'
          let param = {
            company: _this.$store.getters.companyId,
            depart: _this.$store.getters.depart === '' ? '' : this.$store.getters.depart.departID,
            time: _this.$store.getters.time,
            type: _this.$store.getters.chartTypeKey,
            key: _this.code,
            page: _this.page,
            size: _this.size
          }
          let data = {
            'requestBody': JSON.stringify(param)
          }
          _this.$http.post(url, data).then(res => {
            if (res.data.code === 200) {
              _this.detailData = _this.detailData.concat(res.data.data.list)
              if (res.data.data.hasNextPage === false) {
                _this.allLoaded = true
              }
            } else {
              _this.$messagebox({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        } else {
          this.$toast({
            message: '没有更多啦~',
            position: 'bottom',
            duration: 3000
          })
        }
        _this.$refs.loadmoreList.onBottomLoaded()
      }, 500)
    },
    loadTop () {
      let _this = this
      setTimeout(() => {
        this.getDetail()
        _this.$refs.loadmoreList.onTopLoaded()
      }, 500)
    },
    getDetail () {
      let url = '/statistics/getDetail'
      let param = {
        company: this.$store.getters.companyId,
        depart: this.$store.getters.depart === '' ? '' : this.$store.getters.depart.departID,
        time: this.$store.getters.time,
        type: this.$store.getters.chartTypeKey,
        key: this.code,
        page: this.page,
        size: this.size
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(url, data).then(res => {
        if (res.data.code === 200) {
          this.detailData = res.data.data.list
          if (res.data.data.hasNextPage === false) {
            this.allLoaded = true
          }
        } else {
          this.$messagebox({
            title: '错误',
            message: res.data.msg
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.list-container {
  top: 64px;
  left: 5pt;
  right: 5pt;
  bottom: 1pt;
  position: fixed;
  // overflow: scroll;
  display: flex;
  flex-flow: column;
}
.list-total {
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  margin: 0 auto;
  font-size: 1.1rem;
  color: black;
}
.list-data-container {
  position: fixed;
  overflow-y: scroll;
  // top: 7.8rem;
  top: 11.5rem;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  background-color: #FFFFFF;
}
.list-detail-header {
  height: 50px;
  z-index: 20000;
  top: 8rem;
  left: 2rem;
  right: 2rem;
  position: fixed;
  line-height: 50px;
  background-color: #465295;
  display: flex;
  flex-flow: row;
  .header-left {
    width: 49%;
    color: white;
  }
  .header-right {
    width: 49%;
    color: white;
  }
}
.list-detail-data {
  width: 100%;
  position: relative;
  top: 0px;
  bottom: 0pt;
  overflow-y: scroll;
  .list-detail-item {
    width: 100%;
    height: 45px;
    line-height: 45px;
    color: black;
    display: flex;
    flex-flow: row;
    border-bottom: #e5e5e7 0.1pt solid;
    color: #465295;
    .detail-left {
      width: 49%;
    }
    .detail-right {
      width: 49%;
    }
  }
}
.mint-loadmore-bottom span {
  display: inline-block;
  -webkit-transition: .2s linear;
  transition: .2s linear;
  vertical-align: middle
}
.mint-loadmore-bottom span.is-rotate {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg)
}
.mint-loadmore-top span {
  display: inline-block;
  vertical-align: middle
}
.mint-loadmore-top span.is-rotate {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg)
}
</style>
