<template>
  <div>
    <mt-header :title="headerTitle" fixed>
      <router-link :to="backLink" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="todo_card_body">
      <div v-for="(n, index) in rows" :key="index" class="todo_card" @click="handle_todo_card(n)">
        <div class="todo_card_content" @click="showDoneDetail(n)">
          <div class="list1">
            <img src="@/assets/a7.png"/>
            <div>
              <span class="value" style="font-size: 13pt;margin-left: 6pt">{{rows[index].task_username}}</span>
            </div>
          </div>
          <div class="list2">
            <span class="label">任务编号：</span>
            <span class="value" v-if="rows[index].biz_djbh === 'null' || rows[index].task_id === ''"></span>
            <span  class="value" v-else>{{rows[index].biz_djbh}}</span>
          </div>
          <div>
            <span class="label">发起时间：</span>
            <span class="value" v-if="rows[index].task_time === 'null' || rows[index].task_time === ''"></span>
            <span class="value" v-else>{{rows[index].task_time}}</span>
          </div>
          <div style="margin-bottom: 10pt;">
            <span class="label">发起部门：</span>
            <span class="value" v-if="rows[index].task_unit === 'null' || rows[index].task_unit === ''"></span>
            <span class="value" v-else>{{rows[index].task_unit}}</span>
          </div>
          <div style="margin-bottom: 10pt" v-show="task_type === 'pending'">
            <div class="btnDetail" @click="showToDoDetail(n)">查看详情</div>
            <mt-button class="passbtn" size="small" style="float: right;margin-right: 10pt;" @click="subPass(n)">同意</mt-button>
            <mt-button class="failbtn" size="small" style="float: right" @click="subFail(n)">拒绝</mt-button>
          </div>
        </div>
      </div>
    </div>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      // 事项数组
      rows: [],
      task_type: '',
      headerTitle: '',
      // 保存已办流程id 用于获取详情
      flow_id: '',
      // 点击返回跳转的路由
      backLink: '',
      // 请求时传递的页码参数
      page: 1,
      // 请求时传递的长度
      length: 5,
      // 设置操作表是否可可见
      sheetVisible: false,
      // 操作表的动作数组
      actions: [{
        name: '显示流程',
        method: this.goFlowBody
      }, {
        name: '显示单据',
        method: this.goListBody
      }],
      // 操作表用的数据
      val: ''
    }
  },
  created: function () {
    // 获取状态值
    this.task_type = this.missionTaskType
    this.flow_id = this.missionFlowId
    this.rows = this.missionRows
    this.headerTitle = this.missionTitle
    if (this.task_type === 'pending') {
      // this.headerTitle = '我的待办'
      this.backLink = '/missionToDo?userName=' + this.missionEmpNum
    } else if (this.task_type === 'processed') {
      // this.headerTitle = '我的已办'
      this.backLink = '/missionDone?userName=' + this.missionEmpNum
    }
  },
  methods: {
    handle_todo_card (val) {
      console.log('点击卡片====')
      console.log(JSON.stringify(val))
    },
    // 点击待办卡片
    showDoneDetail (val) {
      if (this.task_type === 'pending') {
        console.log('我的待办卡片')
      } else if (this.task_type === 'processed') {
        this.sheetVisible = true
        this.val = val
      }
    },
    // 当为“我的待办”时，点击“查看详情”触发的方法
    showToDoDetail (val) {
      let params = {
        flowId: val.flow_id,
        objGuid: val.obj_guid,
        empNum: this.$store.getters.missionEmpNum,
        bizDJBH: val.biz_djbh
      }
      this.$store.dispatch('modifyMissionFlowDetail', params)
      this.$router.push({
        path: '/danjuListBody'
      })
      this.$store.dispatch('modifyDjbhItem', val.biz_djbh)
      this.$store.dispatch('modifyTypeDjbh', val.flow_id)
      this.$store.dispatch('modifyPathStatus', 'toDoCard')
    },
    // 点击同意，触发的方法
    subPass (val) {
      this.card_data = val
      let url = '/process/submitTaskData'
      let params = {
        userType: '1',
        bizDjbh: val.biz_djbh,
        objGuid: val.obj_guid,
        flowId: val.flow_id,
        nodeId: val.node_id,
        bizMdl: val.biz_mdl,
        opId: val.op_id,
        bizUnit: val.biz_unit,
        opProcNote: '同意',
        empName: val.task_username,
        mdlId: val.biz_mdl,
        edgeId: '',
        opLevel: '',
        n2nTaskToUser: '',
        n2nTaskToUserName: ''
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(url, data).then((val) => {
        if (val.data.code === 200) {
          this.$toast({
            message: '成功处理！',
            iconClass: 'icon icon-success',
            position: 'middle',
            duration: 3000
          })
          this.refrashData()
        } else if (val.data.code === 500) {
          let msg = val.data.msg
          this.$messagebox({
            title: '提示',
            message: msg,
            showCancelButton: true
          })
        }
      })
    },
    // 点击拒绝，触发的方法
    subFail (val) {
      let url = '/process/submitTaskData'
      let params = {
        userType: '1',
        bizDjbh: val.biz_djbh,
        objGuid: val.obj_guid,
        flowId: val.flow_id,
        nodeId: val.node_id,
        bizMdl: val.biz_mdl,
        opId: val.op_id,
        bizUnit: val.biz_unit,
        opProcNote: '不同意',
        empName: val.task_username,
        mdlId: val.biz_mdl,
        edgeId: '',
        opLevel: '',
        n2nTaskToUser: '',
        n2nTaskToUserName: ''
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(url, data).then((val) => {
        if (val.data.code === 200) {
          this.$toast({
            message: '成功处理！',
            iconClass: 'icon icon-success',
            position: 'middle',
            duration: 3000
          })
          this.refrashData()
        } else if (val.data.code === 500) {
          let msg = val.data.msg
          this.$messagebox({
            title: '提示',
            message: msg,
            showCancelButton: true
          })
        }
      })
    },
    // 重新加载获取流程信息，更新页面
    refrashData () {
      let getToDoMissionurl = '/process/TodoList'
      let param = {
        empNum: this.missionEmpNum,
        task_type: this.missionTaskType
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(getToDoMissionurl, data).then((val) => {
        // 用于判断是当前类别的待办任务的数量，重新请求后，若该类别还有待办任务，则重新赋值，反之到待办列表界面
        var res = 0
        // 保存待办任务列表
        let tempData = val.data.data.rowSetArray
        tempData.forEach(element => {
          let index = element.flow_id
          if (index === this.flow_id) {
            this.rows = element.rows
            res = res + 1
          }
        })
        if (res === 0) {
          this.$router.push({
            path: '/missionToDo',
            query: {
              userName: this.missionEmpNum
            }
          })
        }
      })
    },
    // 显示流程
    goFlowBody () {
      let params = {
        flowId: this.val.flow_id,
        objGuid: this.val.obj_guid,
        empNum: '9999',
        bizDJBH: this.val.biz_djbh
      }
      this.$router.push({
        path: '/flowDetails',
        query: {
          // 传递JSON格式，传数组还未找到方法
          data: JSON.stringify(params)
        }
      })
      // 改变pathStatus状态，用于跳转到的流程详情页面
      this.$store.dispatch('modifyPathStatus', 'toDoCard')
    },
    // 跳转到单据详情页面，并改变共享变量的状态
    goListBody () {
      this.$store.dispatch('modifyDjbhItem', this.val.biz_djbh)
      this.$store.dispatch('modifyTypeDjbh', this.val.flow_id)
      this.$store.dispatch('modifyPathStatus', 'doneCard')
      this.$router.push('/danjuListBody')
    }
  },
  computed: {
    // 映射为计算属性
    ...mapGetters([
      'missionTaskType',
      'missionFlowId',
      'missionRows',
      'missionTitle',
      'missionEmpNum'
    ])
  }
}
</script>
<style lang="less">
body {
  margin: 0px;
  background-color: rgb(243, 243, 243);
}
.mint-actionsheet-listitem, .mint-actionsheet-button {
  height: 38pt;
  font-size: 12pt;
  color: #1C76F2;
}
.mint-actionsheet-button {
  color: #333;
  height: 44pt;
}
.mint-actionsheet {
  bottom: 0pt;
}
.todo_card_body{
  width: 100%;
  margin-top: 55pt;
  margin-bottom: 30pt
}
.todo_card {
  background-color: white !important;
  width: 100%;
  margin: 0 auto;
  text-align: left;
  margin-bottom: 8pt;
}
.todo_card_content {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  font-size: 10pt;
  .list1 {
    margin-top: 9pt;
    display: flex;
    flex-flow: row;
    img {
      width: 20pt;
      height: 20pt;
      padding-top: 0pt;
    }
    div {
      width: 70%;
      line-height: 20pt;
    }
  }
  .list2 {
    margin-top: 5pt;
  }
  .label {
    color: rgb(141, 139, 139);
    font-size: 10pt;
  }
  .value {
    font-size: 10pt;
  }
}
.mint-button--small {
  margin-right: 10pt;
}
.btnDetail {
  width: 47pt;
  float: left;
  font-size: 10pt;
  padding-top: 5pt;
  color: #465295 !important
}
.failbtn {
  background-color: white !important;
  border: #465295 1pt solid !important;
  color: #465295 !important;
}
.passbtn {
  background-color: #465295 !important;
  color: #fff !important;
}
</style>
