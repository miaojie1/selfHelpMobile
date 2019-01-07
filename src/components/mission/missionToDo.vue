<template>
  <div>
    <mt-header title="我的待办" fixed>
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
    <div v-if="(toDoTotalData === '' || toDoTotalData === undefined) && show === false">
      <no-data title="待办任务"></no-data>
    </div>
    <div class="mission_listContent" v-else-if="toDoTotalData != '' && show === false">
      <div class="mission_contentItem">
        <div v-for="(n, index) in toDoTotalData" :key="index" class="item" @click="handleToDoItem(n)">
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
      // 待办保存待办的数据
      toDoTotalData: [],
      // 已办保存的数据
      haveDoneTotalData: [],
      // 判断加载动画是否显示
      show: true
    }
  },
  created: function () {
    // 设置用户全局变量
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    // 设置任务类型全局变量，待办or已办
    this.$store.dispatch('modifyMissionTaskType', 'pending')
    this.getToDoMission()
  },
  methods: {
    // 点击某类待办任务
    handleToDoItem (val) {
      this.$store.dispatch('modifyMissionTitle', val.task_type)
      this.$store.dispatch('modifyMissionRows', val.rows)
      this.$store.dispatch('modifyMissionFlowId', val.flow_id)
      this.$router.push({
        path: '/toDoCard'
      })
    },
    // 获取待办任务详情
    getToDoMission () {
      let getToDoMissionurl = '/process/TodoList'
      let param = {
        empNum: this.$store.getters.missionEmpNum,
        task_type: this.$store.getters.missionTaskType
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(getToDoMissionurl, data).then((val) => {
        if (val.data.code === 200) {
          this.toDoTotalData = val.data.data.rowSetArray
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.msg
          })
        }
        this.show = false
      }).catch((val) => {
        this.$messagebox({
          title: '错误',
          message: val.data
        })
        this.show = false
      })
    },
    handleBack () {
      window.webkit.messageHandlers.Call.postMessage({})
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
  .item{
    width: 98%;
    height: 50pt;
    float: left;
    text-align: left;
    padding-top: 4pt;
    padding-left: 5pt;
    margin-top: 5pt;
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
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      p {
        width: 100%;
        font-size: 10pt;
        line-height: 13pt;
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
