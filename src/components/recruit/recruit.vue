<template>
  <div>
    <mt-header title="内部招聘" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="handleBack">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="handleApplyRecord">申请记录</mt-button>
    </mt-header>
    <div v-if="recruitData === '' || recruitData === null">
      <no-data title="招聘信息"></no-data>
    </div>
    <div v-else class="re_content">
      <mt-loadmore
       :top-method="loadTop"
       :bottom-method="loadBottom"
       @top-status-change="handleTopChange"
       @bottom-status-change="handleBottomChange"
       :distance-index="distanceIndex"
       :top-distance="topDistance"
       :bottom-distance="bottomDistance"
       :auto-fill="allLoaded"
       :max-distance="150"
       ref="loadmore">
        <div class="re_item" v-for="(n,index) in recruitData" :key="index" @click="handleItem(n.id)">
          <div class="re_content_text">
            <p class="re_itemP1">{{n.H_ZWMC}}</p>
            <span>{{n.H_GZDD}}&nbsp;|&nbsp;{{n.H_ZPRS}}&nbsp;|&nbsp;{{n.H_BM_ETIME}}</span>
            <p class="re_itemP2">{{n.H_ZPDW}}</p>
          </div>
          <div class="re_content_img" v-if="n.isApply === 'false'">
            <img src="@/assets/right.png" />
          </div>
          <div class="apply-pic" v-else-if="n.isApply === 'true'">
            <img src="@/assets/apply.png" />
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
</template>
<script>
import {mapGetters} from 'vuex'
import noData from '@/components/common/noData'
export default {
  data () {
    return {
      recruitData: [],
      dataLength: '',
      // 可以进行上拉
      allLoaded: false,
      // 请求时传递的页码参数
      page: 1,
      // 请求职位列表，一次请求的长度
      length: 6,
      bottomStatus: '',
      topStatus: '',
      distanceIndex: 2,
      isApply: false,
      topDistance: 70,
      bottomDistance: 70
    }
  },
  created: function () {
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    this.backUrl = '/index?userName=' + this.$route.query.userName
    this.getFirstData(this.page, this.length)
  },
  methods: {
    // 获取所有职位的列表
    getFirstData (page, length) {
      let _this = this
      // 将数据已满状态设置为false
      _this.allLoaded = false
      var getPosturl = '/recruit/list'
      var param = {
        type: '2',
        empNum: this.missionEmpNum,
        length: length, // 分页查询的长度
        search: '', // 搜索值为空时查询全部
        page: page // 分页查询页码
      }
      var data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(getPosturl, data).then((value) => {
        _this.recruitData = value.data.data
        _this.$refs.loadmore.onTopLoaded()
        _this.page = 1
      })
    },
    // 单击某一职位，传递职位的id
    handleItem (id) {
      // 进入职位详情页
      this.$router.push({
        path: '/detail',
        query: {
          recruitId: id,
          isMyPost: '0', // 0代表职位列表
          userName: this.missionEmpNum
        }
      })
    },
    // 下拉方法
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    // 上拉方法
    handleTopChange (status) {
      this.topStatus = status
    },
    // 下拉刷新，触发的方法
    loadTop () {
      let _this = this
      setTimeout(() => {
        // 重新加载，获取第一页
        _this.getFirstData(1, _this.length)
      }, 1000)
    },
    // 上拉加载，触发的方法
    loadBottom () {
      let _this = this
      setTimeout(() => {
        if (!this.allLoaded) {
          _this.page = _this.page + 1
          let getPosturl = '/recruit/list'
          let param = {
            type: '2',
            empNum: this.missionEmpNum,
            length: _this.length, // 分页查询的长度
            search: '', // 搜索值为空时查询全部
            page: _this.page // 分页查询页码
          }
          let data = {
            'requestBody': JSON.stringify(param)
          }
          this.$http.post(getPosturl, data).then((value) => {
            _this.recruitData = _this.recruitData.concat(value.data.data)
            window.localStorage.setItem('recruitData', JSON.stringify(_this.recruitData))
            _this.$refs.loadmore.onBottomLoaded()
            if (value.data.data.length < 6) {
              _this.allLoaded = true // 若数据已全部获取完毕
            }
          })
        } else {
          this.$refs.loadmore.onBottomLoaded()
          this.$toast({
            message: '没有更多啦~',
            position: 'bottom',
            duration: 3000
          })
        }
      }, 500)
    },
    // 跳转到申请记录页面
    handleApplyRecord () {
      this.$router.push({
        path: '/myRecord'
      })
    },
    checkIsApply (postId) {
      var url = '/recruit/position'
      let params = {
        origin: '0',
        id: postId,
        userNum: this.$store.getters.missionEmpNum
      }
      let data = {
        requestBody: JSON.stringify(params)
      }
      this.$http.post(url, data).then((value) => {
        this.isApply = value.data.data.isApply
      }).catch((val) => {
        console.log('职位列表 职位详情出错！')
      })
    },
    handleBack () {
      window.webkit.messageHandlers.Call.postMessage({})
    }
  },
  computed: {
    ...mapGetters([
      'missionEmpNum'
    ])
  },
  components: {
    noData
  }
}
</script>
<style lang="less">
body {
  margin: 0px !important;
  background-color: rgb(243, 243, 243);
}
.mint-loadmore-top span {
  display: inline-block;
  vertical-align: middle
}
.mint-loadmore-top span.is-rotate {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg)
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
.re_content {
  position: fixed;
  top: 65px;
  // bottom 一定要设置，不设置会出现卡顿，滚动事件与下拉事件冲突！！！
  bottom: 2px;
  height: auto;
  width: 100%;
  background-color: rgb(243, 243, 243);
  overflow: scroll;
  // -webkit-overflow-scrolling: touch;
  .re_content_text {
    width: 80%;
    float: left;
  }
  .re_content_img {
    width: 10%;
    margin-left: 10pt;
    float: left;
    padding-top: 25pt;
    img {
      width: 14pt;
      height: 14pt;
    }
  }
}
.re_item {
  width: 100%;
  height: 65pt;
  margin-top: 6pt;
  background-color: white;
  text-align: left;
  padding-left: 10pt;
  .apply-pic {
    float: right;
    width: 10%;
    margin-top: 1pt;
    margin-right: 5pt;
    img {
      width: 18pt;
      height: 18pt;
    }
  }
}
.re_item span {
  font-size: 11pt;
  color: rgb(173, 172, 172)
}
.re_itemP1 {
  font-size: 12pt;
  font-weight: 500;
  padding-top: 8pt;
  line-height: 20pt;
  margin: 0px;
}
.re_itemP2 {
  font-size: 10pt;
  font-weight: 400;
  line-height: 20pt;
  margin: 0px;
}
.noDataDiv {
  width: 100%;
  height: 50%;
  margin: 0 auto;
  img {
    width: 30%;
    height: 30%;
    margin-top: 20pt;
  }
  p {
    margin-top: -10pt;
    font-size: 11pt;
  }
}
</style>
