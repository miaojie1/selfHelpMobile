<template>
  <div>
    <mt-header title="我的已办" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="handleBack">返回</mt-button>
      </router-link>
    </mt-header>
    <!-- 数据加载动画 -->
    <div style="width: 100%; height: 100pt;" v-show="show">
      <div style="width: 10%; margin:0 auto; margin-top: 200pt">
        <mt-spinner :size="30" type="fading-circle" style="margin:0 auto;"></mt-spinner>
      </div>
    </div>
    <div v-if="haveDoneTotalData === '' || haveDoneTotalData === undefined">
      <no-data title="已办任务"></no-data>
    </div>
    <div class="mission_listContent" v-else>
      <div class="mission_contentItem">
        <div v-for="(n, index) in haveDoneTotalData" :key="index" class="item" @click="handleDoneItem(n)">
          <div class="item_text">
            <div class="span1">{{n.task_name}}</div>
            <p>{{n.rows[0].task_time}}</p>
          </div>
          <div class="item_img">
            <img src="@/assets/right.png"/>
          </div>
        </div>
      </div>
    </div>
    <div class="fillDiv"></div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import noData from '@/components/common/noData'
export default{
  data () {
    return {
      // 已办保存的数据
      haveDoneTotalData: [],
      // 已办各类任务的具体任务数组
      haveDoneSendData: [],
      show: true
    }
  },
  created: function () {
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    this.$store.dispatch('modifyMissionTaskType', 'processed')
    this.getHaveDoneMission()
  },
  methods: {
    handleDoneItem (n) {
      // 修改missionRows的状态
      this.$store.dispatch('modifyMissionTitle', n.task_type)
      this.$store.dispatch('modifyMissionRows', n.rows)
      this.$router.push({
        path: '/toDoCard'
      })
    },
    // 获取已办数据
    getHaveDoneMission () {
      let _this = this
      let getHaveDoneMissionurl = '/process/TodoList'
      let param = {
        empNum: this.missionEmpNum,
        task_type: this.missionTaskType
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(getHaveDoneMissionurl, data).then((val) => {
        _this.haveDoneTotalData = val.data.data.rowSetArray
        this.show = false
      }).catch((val) => {
        this.show = false
        console.log('获取已办出错！')
      })
    },
    handleBack () {
      this.$store.commit('back', window.localStorage.getItem('mobileType'))
    }
  },
  computed: {
    ...mapGetters([
      'missionTaskType',
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
    margin: 0px;
    background-color: rgb(243, 243, 243);
  }
  .mission_listContent {
    width: 100%;
    background-color: rgb(243, 243, 243);
    margin-top: 48pt;
  }
  .mission_contentItem {
    width: 100%;
    margin-top: 0pt;
  }
  .item{
    width: 96%;
    height: 48pt;
    float: left;
    text-align: left;
    padding-top: 4pt;
    padding-left: 10pt;
    margin-top: 2pt;
    background-color: white;
    border-bottom: 1pt solid rgb(245, 241, 241);
    border-top: 1pt solid rgb(248, 245, 245);
    .item_text {
      width: 70%;
      float: left;
      .span1 {
        width: 100%;
        padding-top: 6pt;
        font-size: 11pt;
        line-height: 14pt;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      p {
        width: 100%;
        font-size: 10pt;
        line-height: 10pt;
        color: #8a8a8a
      }
    }
    .item_img {
      width: 13%;
      float: right;
      img {
        padding-top: 14pt;
        width: 11pt;
        height: 11pt;
      }
    }
  }
  .fillDiv {
    width: 100%;
    height: 30pt;
    float: left;
  }
  // .noDataDiv {
  //   width: 100%;
  //   height: 50%;
  //   margin: 0 auto;
  //   margin-top: 50pt;
  //   img {
  //     width: 62%;
  //     height: 30%;
  //     margin-top: 45pt;
  //   }
  //   p {
  //     margin-top: -10pt;
  //     font-size: 11pt;
  //   }
  // }
</style>
