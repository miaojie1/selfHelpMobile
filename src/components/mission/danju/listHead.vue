<template>
  <div>
    <mt-header :title="title" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="danju_list_head_content">
      <div class="danju_card_head_cell1" v-for="(item, j) in djbh" :key="j" @click="handleDjbhItem(item)">
        <img src="@/assets/formpic.png"/>
        <div class="danju_head_text">
          <div class="danju_head_bianhao">{{item.DJBH}}</div>
          <div class="danju_head_note">{{item.STATUS}}</div>
          <div class="danju_head_time">{{item.TIME}}</div>
        </div>
        <img class="moreImg" src="@/assets/more.png"/>
      </div>
    </div>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
    <div class="fillDiv"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 上个页面传回的单据类别名称，用于页面的header title
      title: '',
      // 上个页面传回的某个单据类别下的单据编号
      djbh: [],
      djbhToSend: '',
      dj_time: '',
      dj_name: '',
      djItem: '',
      backUrl: '',
      // 保存单据头表信息key
      contentKey: [],
      // 保存单据头表信息值
      content: [],
      // 设置操作表是否可可见
      sheetVisible: false,
      // 操作表的动作数组
      actions: [{
        name: '显示流程',
        method: this.goFlowBody
      }, {
        name: '显示单据',
        method: this.goListBody
      }, {
        name: '取回单据',
        method: this.goFetchBody
      }],
      isFirstEnter: false
    }
  },
  created: function () {
    this.backUrl = '/danju?userName=' + this.$store.getters.missionEmpNum
    this.getFormerData()
  },
  methods: {
    // 获取上个页面传回的值 title 以及单据编号，单据类别
    getFormerData () {
      // 一个类型中的一组单据编号djbh
      this.djbh = this.$store.getters.djbh
      this.title = this.$store.getters.title
      this.type_djbh = this.$store.getters.typeDjbh
    },
    handleDjbhItem (val) {
      this.$store.dispatch('modifyDjbhItem', val.DJBH)
      this.dj_time = val.TIME
      this.dj_name = val.NAME
      this.sheetVisible = true
      this.djItem = val
    },
    goListBody () {
      this.$store.dispatch('modifyDjbhItem', this.$store.getters.djbhItem)
      this.$store.dispatch('modifyTypeDjbh', this.type_djbh)
      this.$store.dispatch('modifyPathStatus', 'listHead')
      this.$router.push({
        path: '/danjuListBody'
      })
    },
    goFlowBody () {
      let params = {
        flowId: this.djItem.FLOW_ID,
        objGuid: this.djItem.OBJ_GUID,
        empNum: this.$store.getters.missionEmpNum,
        bizDJBH: this.djItem.DJBH
      }
      this.$router.push({
        path: '/flowDetails',
        query: {
          data: JSON.stringify(params)
        }
      })
      this.$store.dispatch('modifyPathStatus', 'listHead')
    },
    goFetchBody () {
      let url = '/process/reTakeTaskData'
      let params = {
        bizDate: this.djItem.TIME,
        empName: this.djItem.NAME,
        flowId: this.djItem.FLOW_ID,
        nodeId: this.djItem.NODE_ID,
        objGuid: this.djItem.OBJ_GUID,
        bizMdl: this.djItem.BIZ_MDL,
        mdlId: this.djItem.MDL_ID,
        bizDjbh: this.djItem.DJBH,
        opLevel: this.djItem.OP_Level,
        opProcNote: '同意',
        opId: this.djItem.OP_ID,
        pflowId: this.djItem.PFLOW_ID,
        loopId: this.djItem.LOOP_ID
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$messagebox({
        title: '提示',
        message: '确定取回单据?',
        showCancelButton: true,
        showConfirmButton: true
      }).then(action => {
        if (action === 'confirm') {
          this.$http.post(url, data).then((val) => {
            console.log(val.data)
          })
        } else {
          console.log('action=====' + action)
        }
      })
    }
  }
}
</script>
<style lang="less">
body {
  margin: 0px;
  background-color: rgb(243, 243, 243) !important;
}
.mint-actionsheet-listitem, .mint-actionsheet-button {
  height: 38pt !important;
  font-size: 12pt !important;
  color: #1C76F2 !important;
}
.mint-actionsheet-button {
  color: #333 !important;
  background-color: #fff !important;
}
.mint-actionsheet {
  bottom: 0pt;
}
.fillDiv {
  width: 100%;
  height: 30pt;
  float: left;
}
.danju_list_head_content {
  width: 100%;
  display: flex;
  flex-flow: column;
  margin-top: 47pt;
  .danju_card_head_cell1 {
    width: 97%;
    height: 45pt;
    background-color: white;
    margin-top: 5pt;
    padding-top: 7pt;
    padding-left: 7pt;
    img {
      width: 15pt;
      height: 15pt;
      float: left;
      margin-top: -1pt;
      padding-top: 10pt;
      padding-right: 7pt;
    }
    .danju_head_text {
      width: 70%;
      height: 40pt;
      float: left;
      padding-top: 3pt;
      .danju_head_bianhao {
        width: 57%;
        height: 20pt;
        margin-left: -3pt;
        float: left;
        color: #4f578a;
      }
      .danju_head_note {
        width: 24%;
        height: 18pt;
        font-size: 10pt;
        float: left;
        margin-top: -1pt;
        margin-left: 22pt;
        padding-top: 0pt;
        color: #8a8a8a;
      }
      .danju_head_time {
        width: 59%;
        height: 18pt;
        float: left;
        margin-left: -11pt;
        font-size: 10pt;
        color: #8a8a8a;
      }
    }
    .moreImg {
      width: 20pt;
      height: 20pt;
      float: right;
      margin-right: 20pt;
      margin-top: -2pt;
    }
  }
}
</style>
