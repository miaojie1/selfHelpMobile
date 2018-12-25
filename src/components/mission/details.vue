<template>
  <div class="flow-container" ref="flowContainer">
    <mt-header title="流程详情" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="width: 100%; height: 100pt;" v-show="show">
      <div style="width: 10%; margin:0 auto; margin-top: 200pt">
        <mt-spinner :size="30" type="fading-circle" style="margin:0 auto;"></mt-spinner>
      </div>
    </div>
    <div v-if="flowRows === null && show === false">
      <no-data title="流程"></no-data>
    </div>
    <div class="flowContent" v-if="!show && flowRows != null">
      <div class="flowDetails" v-for="(item, index) in flowRows" :key="index">
        <div v-if="item.RESR_STATUS === 'processed'">
          <div class="nodeImgBody">
            <div class="nodeImg">
              <img v-if="item.NODE_TAG_NAME === '开始'" src="@/assets/gray.png"/>
              <img v-if="item.OP_PROC_NOTE === '同意' && item.NODE_TAG_NAME != '开始'" src="@/assets/green.png"/>
              <img v-else-if="item.OP_PROC_NOTE === '不同意' && item.NODE_TAG_NAME != '开始'" src="@/assets/red.png"/>
            </div>
          </div>
          <div class="nodeText">
            <div class="nodeName">
              {{item.OP_PROC_NAME}}
            </div>
            <div v-if="item.OP_PROC_NOTE === '不同意'" style="color: #FF3B30;">
              <div class="nodeTagName">
                ({{item.NODE_TAG_NAME}})
              </div>
              <div class="nodeNote">
                {{item.OP_PROC_NOTE}}
              </div>
            </div>
            <div v-else-if="item.OP_PROC_NOTE === '同意'" style="color: #05A824">
              <div v-if="item.NODE_TAG_NAME == '开始'">
                <div class="nodeTagName" style="color: #8a8b8d;">
                  提交制单
                </div>
              </div>
              <div v-else>
                <div class="nodeTagName" >
                  ({{item.NODE_TAG_NAME}})
                </div>
                <div class="nodeNote">
                  {{item.OP_PROC_NOTE}}
                </div>
              </div>
            </div>
            <div class="nodeDate">
              {{item.OP_PROC_TIME | formatDate}}
            </div>
          </div>
        </div>
        <div v-else-if="item.RESR_STATUS === 'pending'">
          <div>
            <div class="nodeImgBody">
              <div class="nodeImg" style="border: none">
                <img src="@/assets/gray.png"/>
              </div>
            </div>
            <div class="nodeText">
              <div class="nodeTagName" v-if="item.NODE_TAG_NAME === '开始'" style="font-size: 10pt;margin-left: 0pt">
                提交制单
              </div>
              <div class="nodeTagName" v-else style="font-size: 10pt;margin-left: 0pt">
                {{item.NODE_TAG_NAME}}
              </div>
              <div class="nodeTextPending" style="font-size: 9pt">
                (待审批)
              </div>
            </div>
          </div>
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
      data: '',
      // 保存接口返回流程
      flowRows: [],
      // 保存格式化后的时间
      op_date: [],
      // 点击返回，返回的url
      backUrl: '',
      // 加载动画，是否显示
      show: true,
      clientHeight: ''
    }
  },
  created: function () {
    // 获取查询流程的参数
    this.data = JSON.parse(this.$route.query.data)
    // 由于组件的复用 返回时跳转的路由不同，加一个pathStatus参数，用于判断跳转的路由
    if (this.$store.getters.pathStatus === 'toDoCard') {
      this.backUrl = '/toDoCard'
    } else if (this.$store.getters.pathStatus === 'listBody') {
      this.backUrl = '/danjuListBody'
    } else if (this.$store.getters.pathStatus === 'listHead') {
      this.backUrl = '/danjuListHead'
    }
    // 获取流程详情
    this.getFlowDetails()
  },
  methods: {
    // 获取流程详情方法
    getFlowDetails () {
      let detailUrl = 'process/QueryFlowTaskData'
      let data1 = {
        'requestBody': JSON.stringify(this.data)
      }
      this.$http.post(detailUrl, data1).then((val) => {
        this.flowRows = val.data.data.rowSetArray
        this.show = false
      }).catch((val) => {
        console.log(val.data)
      })
    },
    changeFixed (clientHeight) {
      this.$refs.flowContainer.style.height = clientHeight + 'px'
    }
  },
  // 格式化时间
  filters: {
    formatDate: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  beforeMount () {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    // 减去页面上固定高度height
    this.clientHeight = h - 64
  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
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
.flow-container {
  width: 100%;
  height: 100%;
  background-color: white;
}
.flowContent {
  width: 100%;
  margin-top: 50pt;
  display: flex;
  flex-flow: column;
  padding-top: 10pt;
  background-color: white
}
.flowDetails {
  width: 95%;
  margin: 0 auto;
  height: 43pt;
  display: inline;
  .nodeImgBody {
    float: left;
    width: 8%;
    text-align: right;
    color: #465295;
    font-size: 11pt;
    .nodeImg {
      width: 10%;
      height: 43pt;
      float: left;
      margin-top: 4pt;
      margin-left: 4pt;
      border-left: 1px dashed rgb(180, 178, 178);
      img {
        width: 20pt;
        height: 20pt;
        float: left;
        margin-left: -10pt;
        margin-top: -7pt;
      }
    }
  }
  .nodeText {
    width: 92%;
    float: left;
    margin-left: -6pt;
    text-align: left;
    font-size: 11pt;
    .nodeName {
      float: left;
      margin-top: 0pt;
      font-size: 11pt;
    }
    .nodeTagName {
      float: left;
      margin-left: 5pt;
      font-size: 9pt;
    }
    .nodeDate {
      float: right;
      margin-top: 2pt;
      font-size: 9pt;
      color: #a8abad;
    }
    .nodeNote {
      font-size: 9pt;
      margin-top: 0pt;
      margin-left: 5pt;
      float: left;
    }
    .nodeTextPending {
      font-size: 10pt;
      float: left;
      margin-left: 5pt;
      width: 25%;
      color: #8a8b8d;
    }
  }
}
</style>
