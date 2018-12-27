<template>
  <div style="background-color:#F8F8F8">
    <mt-header title="职位详情" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="detail_contentDetail">
      <div class="detail_card_top">
        <mt-cell title="所属公司:">{{detail.company}}</mt-cell>
        <mt-cell title="职位类别:">{{detail.type}}</mt-cell>
        <mt-cell title="工作地点:">{{detail.place}}</mt-cell>
        <mt-cell title="工作性质:">{{detail.property}}</mt-cell>
        <mt-cell title="招聘人数:">{{detail.number}}</mt-cell>
        <mt-cell title="发布日期:">{{detail.time}}</mt-cell>
        <mt-cell title="报名开始日期:">{{detail.startTime}}</mt-cell>
        <mt-cell title="报名结束日期:">{{detail.endTime}}</mt-cell>
      </div>
      <div class="detail_header_name">
        任职要求
      </div>
      <div class="detail_card_mid">
        <mt-cell title="年龄要求:">{{detail.age}}</mt-cell>
        <mt-cell title="性别要求:">{{detail.sex}}</mt-cell>
        <mt-cell title="经验要求:">{{detail.experience}}</mt-cell>
        <mt-cell title="学历要求:">{{detail.education}}</mt-cell>
        <mt-cell title="专业要求:">{{detail.major}}</mt-cell>
        <mt-cell title="其他要求:">{{detail.other}}</mt-cell>
      </div>
      <div v-show="isShow == true">
        <div class="detail_header_name">
        职位描述
        </div>
        <div class="detail_card_bottom">
          <div class="detail_postProfile">{{detail.profile}}</div>
        </div>
      </div>
    </div>
    <mt-button v-if="isMyPost === '1' && isApply === 'true'" class="detail_submitBtn" @click="cancelApply">取消申请</mt-button>
    <mt-button v-else-if="isMyPost === '0' && isApply === 'false'" class="detail_submitBtn" @click="apply">我要申请</mt-button>
    <mt-button v-else-if="isMyPost === '0' && isApply === 'true'"  disabled class="detail_submitBtn">已申请</mt-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 职位详情
      detail: [],
      // 职位id
      postId: '',
      // 申请职位返回结果
      status: '',
      // 用户id
      userId: '',
      isMyPost: false,
      // 头部title
      title: '',
      // 头部点击back，跳转的url
      backUrl: '',
      // 是否已经应聘的标识，判断isApply的值显示不同的按钮
      isApply: 'false',
      // 是否显示“职位描述”的标识，根据isShow的值来决定是否显示职位描述
      isShow: true
    }
  },
  created: function () {
    let _this = this
    let postDetailUrl = '/recruit/position'
    // 接收路由传递的参数
    this.postId = this.$route.query.recruitId
    this.isMyPost = this.$route.query.isMyPost
    this.userId = this.$route.query.userName
    // 职位列表详情 和申请记录详情 公用组件，返回到不同的url
    if (this.isMyPost === '1') {
      this.backUrl = '/myRecord?userName=' + this.$route.query.userName
    } else {
      this.backUrl = '/recruit?userName=' + this.$route.query.userName
    }
    var param = {
      origin: '0',
      id: this.postId,
      userNum: this.userId
    }
    var data = {
      'requestBody': JSON.stringify(param)
    }
    this.$http.post(postDetailUrl, data).then((val) => {
      // 保存职位详情
      this.detail = val.data.data
      // 保存是否已申请字段
      this.isApply = val.data.data.isApply
      if (this.detail.profile === null || this.detail.profile === ' ' || this.detail.profile === '') {
        this.isShow = false
      } else {
        this.isShow = true
        _this.detail.profile = _this.transFont(_this.detail.profile)
      }
    })
  },
  methods: {
    // 申请职位
    apply () {
      let applyUrl = '/recruit/toApply'
      var param = {
        origin: '0',
        positionId: this.postId,
        userId: this.userId
      }
      var data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(applyUrl, data).then((val) => {
        let msg = val.data.msg
        let code = val.data.code
        // 根据返回的code分类结果
        if (code === 200) {
          this.$toast({
            message: '申请成功',
            iconClass: 'icon icon-success'
          })
          this.$router.push({
            path: '/recruit'
          })
        } else {
          this.$messagebox({
            title: '温馨提示',
            message: msg,
            confirmButtonText: '确定'
          })
        }
      })
    },
    // 取消申请职位
    cancelApply () {
      let cancelApplyUrl = '/recruit/disapply'
      var param = {
        origin: '0',
        positionId: this.postId,
        userId: this.userId
      }
      var data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(cancelApplyUrl, data).then((val) => {
        // 返回结果，，1为成功，2为失败
        let result = val.data.data.result
        if (result === '1') {
          this.$toast({
            message: '取消申请成功',
            iconClass: 'icon icon-success'
          })
          this.$router.push({
            path: '/myRecord'
          })
        } else if (result === '0') {
          this.$messagebox({
            title: '温馨提示',
            message: '取消申请失败',
            confirmButtonText: '确定'
          })
        } else if (val.data.code === 500) {
          this.$messagebox({
            title: '温馨提示',
            message: val.data.msg,
            confirmButtonText: '确定'
          })
        }
      })
    },
    // 接口返回的职位详情有html的标签，此方法去掉html标签
    transFont (preVal) {
      // 将所有的html标签替换成换行 但是只在控制台打印时起作用，页面显示的时候，只是将html标签换了空
      return preVal.replace(/<\/?.+?>/g, '\n')
    }
  }
}
</script>
<style lang="less">
  body{
    margin: 0px !important;
  }
  .mint-cell {
    min-height: 39px;
    .mint-cell-text {
      font-size: 10pt;
    }
    .mint-cell-value {
      font-size: 10pt;
    }
  }
  .detail_contentDetail {
    width: 100%;
    height: 80%;
    background-color: #F8F8F8;
    margin-top: 48pt;
    margin-bottom: 20pt;
    padding-top: 2pt;
  }
  .detail_card_top {
    width: 95%;
    background-color: #FFFFFF;
    margin: 0 auto;
    text-align: left;
    margin-bottom: 10pt
  }
  .detail_card_mid {
    width: 95%;
    background-color: #FFFFFF;
    margin: 0 auto;
    text-align: left;
    margin-top: 10pt;
    margin-bottom: 10pt
  }
  .detail_card_bottom {
    width: 95%;
    background-color: #FFFFFF;
    margin: 0 auto;
    text-align: left;
    margin-top: 10pt;
    margin-bottom: 10pt
  }
  .detail_submitBtn {
    width: 90%;
    margin: 0 auto;
    font-size: 13pt !important;
    border-radius: 10pt !important;
    margin-bottom: 20pt !important;
    color: white !important;
    background-color: #465295 !important;
  }
  .detail_postProfile {
    width: 98%;
    line-height: 17.5pt !important;
    background-color: #FFFFFF;
    padding-left: 5pt;
    padding-right: 5pt;
    font-size: 10pt;
  }
  .detail_header_name {
    font-size: 14pt;
    font-weight: 500;
    text-align: left;
    padding-left: 10px;
    width: 95%;
    margin: 0 auto
  }
</style>
