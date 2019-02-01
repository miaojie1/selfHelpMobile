<template>
  <div class="infor-container" ref="inforContainer">
    <mt-header title="个人信息" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="handleBack">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="infor_header">
      <span>{{content.H_HU_NAME}}</span>
    </div>
    <!-- 加载动画 -->
    <div style="width: 100%; height: 100pt;" v-show="show">
      <div style="width: 10%; margin:0 auto; margin-top: 100pt">
        <mt-spinner :size="30" type="fading-circle" style="margin:0 auto;"></mt-spinner>
      </div>
    </div>
    <div v-show="content.length === 0 && !show">
      <no-data title="个人信息"></no-data>
    </div>
    <div class="infor_content" v-show="!show">
      <div class="infor_card_item" v-for="(n,m) in contentKey" :key="m">
        <div v-if="n.title === '性别'">
          <span class="infor_name">{{n.title}}</span>
          <span class="infor_value" v-if="content[n.key] === 'M'">男</span>
          <span class="infor_value" v-else>男</span>
        </div>
        <div v-else>
          <span class="infor_name">{{n.title}}</span>
          <span class="infor_value">{{content[n.key]}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import noData from '@/components/common/noData'
export default {
  data () {
    return {
      // 保存个人信息的值
      content: [],
      // 保存个人信息的key值
      contentKey: [],
      // 暂存 个人信息的内容 将接口返回的数据保存在3个数组中
      keyValue: [],
      // 暂存 个人信息key
      key: [],
      // 暂存 个人名称的具体标题
      keyText: [],
      clientHeight: '',
      // 加载框是否显示
      show: true
    }
  },
  created: function () {
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    this.getInfor()
  },
  methods: {
    // 获取个人信息
    getInfor () {
      let _this = this
      let getInforUrl = '/personal/info'
      let params = {
        empNum: this.$store.getters.missionEmpNum
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(getInforUrl, data).then((val) => {
        if (val.data.code === 200) {
          this.content = val.data.data.content
          this.contentKey = val.data.data.contentKey
          setTimeout(function () {
            _this.show = false
          }, 100)
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.msg
          })
          _this.show = false
        }
      }).catch(err => {
        this.$messagebox(err)
      })
    },
    changeFixed (clientHeight) {
      this.$refs.inforContainer.style.height = clientHeight + 'px'
    },
    handleBack () {
      this.$store.commit('back', window.localStorage.getItem('mobileType'))
    }
  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  beforeMount () {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    // 减去页面上固定高度height
    this.clientHeight = h
  },
  components: {
    noData
  }
}
</script>
<style lang="less">
body {
  margin: 0px;
}
.infor-container {
  width: 100%;
  height: 100%;
  background-color: #F8F8F8;
}
.infor_header {
  background-color: #465295;
  width: 100%;
  height: 83pt;
  margin-top: 43pt;
  display: flex;
  flex-flow: column;
  span {
    margin-top: 18pt;
    color: #F8F8F8;
    font-size: 15pt;
  }
}
.infor_header_card {
  width: 93%;
  height: 30pt;
  margin: 0 auto;
  margin-top: 10pt;
  background-color: #FFFFFF
}
.infor_content {
  width: 93%;
  height: fit-content;
  margin: 0 auto;
  margin-top: -33pt;
  background-color: #FFFFFF;
  margin-bottom: 30pt;
  border-radius: 5pt;
}
.infor_card_item {
  width: 95%;
  height: 35pt;
  margin: 0 auto;
  margin-top: 2pt;
  border-bottom: solid 1px rgb(245, 241, 241);
}
.infor_name {
  width: 30%;
  height: 80%;
  float: left;
  color: #8C8C8C;
  font-size: 11pt;
  padding-top: 9pt;
}
.infor_value {
  width: 60%;
  height: 80%;
  float: right;
  font-size: 11pt;
  padding-top: 9pt;
}
// .noDataDiv {
//   width: 100%;
//   height: 50%;
//   margin: 0 auto;
//   img {
//     width: 30%;
//     height: 30%;
//     margin-top: 20pt;
//   }
//   p {
//     margin-top: -10pt;
//     font-size: 11pt;
//   }
// }
</style>
