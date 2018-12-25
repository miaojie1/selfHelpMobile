<template>
  <div class="container" ref="container">
    <mt-header title="WebHR系统" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="handleBack">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="index-body">
      <div class="index-body-title">
        我的事项
      </div>
      <div class="index-body-menu">
        <div class="index-body-item" @click="handleDaiBan">
          <div class="index-item-badge">
            <mt-badge size="small" color="red" v-if="todoCount > 10">10+</mt-badge>
            <mt-badge size="small" color="red" v-else>{{todoCount}}</mt-badge>
          </div>
          <div class="index-item-pic">
            <!-- <img src="@/assets/wodedaiban.png"/> -->
            <img src="@/assets/index-daiban.png"/>
          </div>
          <div class="index-item-title">
            我的待办
          </div>
        </div>
        <div class="index-body-item" @click="handleYiBan">
          <div class="index-item-pic">
            <img src="@/assets/wodeyiban.png"/>
          </div>
          <div class="index-item-title">
            我的已办
          </div>
        </div>
      </div>
      <div class="index-body-title">
        查询统计
      </div>
      <div class="index-body-menu">
        <div class="index-body-item" @click="handleDanJu">
          <div class="index-item-pic">
            <img src="@/assets/wodedanju.png"/>
          </div>
          <div class="index-item-title">
            我的单据
          </div>
        </div>
        <div class="index-body-item" @click="handleWage">
          <div class="index-item-pic">
            <img src="@/assets/wodexinzi.png"/>
          </div>
          <div class="index-item-title">
            我的薪资
          </div>
        </div>
        <div class="index-body-item" @click="handleInfor">
          <div class="index-item-pic">
            <img src="@/assets/gerenxinxi.png"/>
          </div>
          <div class="index-item-title">
            个人信息
          </div>
        </div>
        <div class="index-body-item" @click="handleRecruit">
          <div class="index-item-pic">
            <img src="@/assets/neibuzhaopin.png"/>
          </div>
          <div class="index-item-title">
            招聘信息
          </div>
        </div>
        <div class="index-body-item" @click="handleChart">
          <div class="index-item-pic">
            <img src="@/assets/index-tubiao.png"/>
          </div>
          <div class="index-item-title">
            图表分析
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userName: '',
      toDoTotalData: [],
      todoCount: 0,
      clientHeight: ''
    }
  },
  created () {
    this.userName = this.$route.query.userName
    window.localStorage.setItem('empNum', this.userName)
    this.getToDoData()
    this.getDanjuData()
  },
  watch: {
    toDoTotalData: function (newData, oldData) {
      let res = 0
      for (let i = 0; i < newData.length; i++) {
        for (var row = 0; row < newData[i].rows.length; row++) {
          res++
        }
      }
      this.todoCount = res
    },
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  methods: {
    handleDaiBan () {
      this.$router.push({
        path: '/missionToDo',
        query: {
          userName: this.userName
        }
      })
    },
    handleYiBan () {
      this.$router.push({
        path: '/missionDone',
        query: {
          userName: this.userName
        }
      })
    },
    handleDanJu () {
      this.$router.push({
        path: '/danju',
        query: {
          userName: this.userName
        }
      })
    },
    handleWage () {
      this.$router.push({
        path: '/myWage',
        query: {
          userName: this.userName
        }
      })
    },
    handleInfor () {
      this.$router.push({
        path: '/information',
        query: {
          userName: this.userName
        }
      })
    },
    handleRecruit () {
      this.$router.push({
        path: '/recruit',
        query: {
          userName: this.userName
        }
      })
    },
    handleAboutMe () {
      this.$router.push({
        path: '/inforM'
      })
    },
    handleChart () {
      this.$router.push({
        path: '/chartAnalysis',
        query: {
          userName: this.userName
        }
      })
    },
    handleBack () {
      window.webkit.messageHandlers.Call.postMessage({})
    },
    getToDoData () {
      let getToDoMissionurl = '/process/TodoList'
      let param = {
        empNum: this.userName,
        task_type: 'pending'
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(getToDoMissionurl, data).then((val) => {
        this.toDoTotalData = val.data.data.rowSetArray
      }).catch((val) => {
        alert('获取信息，出现错误')
      })
      // var i = this.toDoTotalData.map(function (item) {
      //   for (var i in item.rows) {
      //     return i++
      //   }
      // })
      // console.log('i===' + this.todoCount)
    },
    getDanjuData () {
      let url = '/process/myInvoices'
      let params = {
        empNum: this.userName
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(url, data).then((val) => {
        this.danJuTotalData = val.data.data.data
      })
    },
    changeFixed (clientHeight) {
      this.$refs.container.style.height = clientHeight + 'px'
    }
  },
  beforeMount () {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    // 减去页面上固定高度height
    this.clientHeight = h - 70
  }
}
</script>
<style lang="less">
body {
  margin: 0pt;
}
.container {
  width: 100%;
  height: 100%;
  margin-top: -2pt;
  background-color: white !important;
}
.index-body {
  width: 96%;
  margin-top: 50pt;
}
.index-body-title {
  width: 100%;
  height: 25pt;
  font-size: 12pt;
  font-weight: 600;
  text-align: left;
  padding-left: 10pt;
  padding-top: 6pt;
}
.index-body-menu {
  width: 100%;
  height: 15%;
  margin-bottom: -10pt;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.index-item-badge {
  width: 20%;
  height: 0%;
  float: right;
  margin-right: 8pt;
  margin-top: -5pt;
}
.index-body-item {
  width: 25%;
  height: 55pt;
  margin-bottom: 6pt;
  .index-item-pic {
    width: 70%;
    margin: 0 auto;
    img {
      width: 68%;
      margin: 0 auto;
    }
  }
  .index-item-title {
    width: 100%;
    font-size: 9pt;
    text-align: center;
    margin-top: 0pt;
  }
}
.mint-badge.is-size-small {
 padding: 0pt 2pt !important;
 width: 14pt !important;
//  margin-top: -5pt !important;
//  margin-left: 44pt !important;
}
</style>
