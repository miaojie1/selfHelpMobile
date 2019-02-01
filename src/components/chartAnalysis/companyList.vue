<template>
  <div>
    <div id="header">
      <div class="company-list-back" @click="handleBack">
        <img src="@/assets/left1.png"/>
        <span>返回</span>
      </div>
      <!-- 头部下拉框 -->
      <div class="select-body" v-if="showNull">
        <input type="text" v-model="selectCompanyValue" readonly/>
      </div>
      <div class="select-body" v-else>
        <input type="text" v-model="selectCompanyValue" readonly @click="showList"/>
        <img src="@/assets/down.png" @click="showList">
      </div>
    </div>
    <!-- 下拉列表 -->
    <div class="select-list-panel" v-show="isShow">
      <div class="select-list-item" v-for="(item, index) in company" :key="index" @click="closeList(item.comPanyID, item.comPanyName)" :class="{haveSelect: selectCompanyValue === item.comPanyName}">
        <div class="select-list-item-name">{{item.comPanyName}}</div>
        <div class="line"></div>
      </div>
    </div>
    <!--页面的遮罩层 -->
    <div id="cover" v-show="isShow" @click="closeList"></div>
    <div id="container" :class="{haveScroll: isShow}">
      <div class="chart-item">
        <img src="@/assets/zaigang.png" @click="handleChart('在岗员工构成', 'H_YGXS')">
        <span>在岗员工构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/ligang.png" @click="handleChart('离岗人员构成', 'H_YDSJ')">
        <span>离岗人员构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/guanli.png" @click="handleChart('管理人员构成', 'H_ZJ')">
        <span>管理人员构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/age.png" @click="handleChart('年龄构成', 'H_AGE')">
        <span>年龄构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/zhuanye.png" @click="handleChart('专业技术资格构成', 'H_ZYJSZWZG')">
        <span>专业技术资格构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/xueli.png" @click="handleChart('学历构成', 'H_XL')">
        <span>学历构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/pinyong.png" @click="handleChart('聘用专业技术职务构成', 'H_PRZYJSZW')">
        <span>聘用专业技术职务构成</span>
      </div>
      <div class="chart-item">
        <img src="@/assets/zhiye.png" @click="handleChart('职业技能等级构成', 'H_ZYJNDJ')">
        <span>职业技能等级构成</span>
      </div>
    </div>
  </div>
</template>
<script>
import noData from '../common/noData'
export default {
  data () {
    return {
      resultsPanel: false,
      results: [],
      company: [],
      depart: [],
      // 下拉框绑定的值
      selectCompanyValue: '',
      selectCompanyId: '',
      // 搜索框绑定的值
      searchValue: '',
      // 控制下拉框是否显示
      isShow: false,
      showDepartList: '',
      chartVisible: false,
      clientHeight: '',
      showNull: false,
      haveDepartPower: ''
    }
  },
  created () {
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    window.localStorage.setItem('empNum', this.$store.getters.missionEmpNum)
    this.$indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
    let date = new Date()
    this.time = date.getFullYear()
    this.$store.dispatch('modifyTime', this.time)
    this.getSelect()
  },
  methods: {
    getSelect () {
      let url = '/statistics/getSelect'
      let param = {
        userID: window.localStorage.getItem('empNum')
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(url, data).then(res => {
        this.$store.dispatch('modifyAllCompanys', res.data.data[0].unitDepartData)
        if (res.data.data[0].unitDepartData.length >= 1) {
          this.selectCompanyValue = res.data.data[0].unitDepartData[0].comPanyName
          this.selectCompanyId = res.data.data[0].unitDepartData[0].comPanyID
          this.company = res.data.data[0].unitDepartData
          this.depart = res.data.data[0].unitDepartData[0].dePart
          this.haveDepartPower = res.data.data[0].unitDepartData[0].haveDePartPower
          this.$store.dispatch('modifyCompany', this.selectCompanyValue)
          this.$store.dispatch('modifyCompanyId', this.selectCompanyId)
          this.$indicator.close()
        } else {
          this.showNull = true
          this.selectCompanyValue = '暂无数据'
          this.$indicator.close()
        }
      })
    },
    showList () {
      this.isShow = true
    },
    closeList (id, value) {
      this.company.forEach(item => {
        if (id === item.comPanyID) {
          this.depart = item.dePart
          this.selectCompanyValue = value
          this.selectCompanyId = id
          this.haveDepartPower = item.haveDePartPower
          this.$store.dispatch('modifyCompany', value)
          this.$store.dispatch('modifyCompanyId', id)
        }
      })
      this.isShow = false
    },
    showChart () {
      this.$store.dispatch('modifyCompany', this.selectCompanyValue)
      this.$store.dispatch('modifyDepart', '')
      this.$store.dispatch('modifyChartTitle', this.$store.getters.company + '图表分析')
      this.$router.push({
        path: '/chartList'
      })
    },
    handleBack () {
      this.$store.commit('back', window.localStorage.getItem('mobileType'))
    },
    handleChart (val, key) {
      this.$store.dispatch('modifyChartType', val)
      this.$store.dispatch('modifyChartTypeKey', key)
      this.$store.dispatch('modifyDepart', '')
      this.$router.push({
        path: '/showChart'
      })
    },
    changeFixed (clientHeight) {
      this.$refs.container.style.height = clientHeight + 'px'
    }
  },
  watch: {
    searchValue: function (value) {
      this.results = []
      if (value === '') {
        this.results = []
      } else {
        var reg = new RegExp(value)
        this.depart.forEach(element => {
          if (reg.test(element.departName)) {
            this.results.push(element)
            this.resultsPanel = true
          }
        })
      }
    },
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  components: {
    noData
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
  margin: 0px;
  width: 100%;
  height: 100%;
}
#header {
  font-size: 12pt;
  background-color:#465295;
  height: 64px;
  width: 100%;
  top: 0px;
  position: fixed;
  z-index: 100;
  .chart-btn {
    width: 15%;
    float: right;
    color: white;
    margin-top: 22pt;
    font-size: 12pt;
    img {
      width: 40%;
      height: 40%;
    }
  }
}
.company-list-back {
  width: 18%;
  height: 100%;
  float: left;
  color: white;
  display: inline;
  img {
    width: 13pt;
    height: 13pt;
    float: left;
    margin-left: 8pt;
    margin-top: 25pt;
  }
  span {
    // 如果不加display: block,则span设置样式不起作用
    display: block;
    width: 26pt;
    font-size: 12pt;
    float: left;
    margin-top: 24pt;
    margin-left: 1pt;
  }
}
.select-body {
  width: 66%;
  height: 25pt;
  margin-left: 0pt;
  margin-top: 10pt;
  float: left;
  position: relative;
  img {
    margin-top: 13pt;
    margin-left: -20pt;
    width: 20pt;
  }
  input {
    background: #465295;
    outline: none;
    border: 0px;
    width: 70%;
    float: left;
    text-align: center;
    margin-left: 5pt;
    color: white;
    margin-top: 13pt;
    font-size: 13pt;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.select-list-panel {
  width: 100%;
  z-index: 9999;
  height: 100%;
  overflow-y: scroll;
  position: absolute;
  background-color: white;
  margin-top: 48pt;
  .select-list-item {
    width: 100%;
    height: 36pt;
    line-height: 36pt;
    font-size: 12pt;
    text-align: left;
    display: flex;
    flex-flow: column;
    .select-list-item-name {
      display: block;
      width: 90%;
      height: 35pt;
      margin-left: 10pt;
    }
    .line {
      width: 100%;
      height: 0.5pt;
      margin: 0 auto;
      margin-left: 0pt;
      background: #D9D9D9;
    }
  }
}
select {
  background: #465295;
  //清除select的边框样式
  border: none;
  //清除select聚焦时候的边框颜色
  outline: none;
  width: 100%;
  line-height: 40px;
  //隐藏select的下拉图标
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  //通过padding-left的值让文字居中
  padding-left: 22px;
  float: left;
  color: white;
  margin-top: 4pt;
  font-size: 12pt;
  option::-ms-expand {
    display: none;
  }
  option {
    -moz-appearance:none; /* Firefox */
    -webkit-appearance:none; /* Safari 和 Chrome */
    appearance:none;
    opacity: 0.3 !important;
    color:#465295;
    background-color:white;
    border: none;
  }
}
#cover {
  position: fixed;
  left: 0px;
  top: 0px;
  background-color: #000000;
  width: 100%;  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  margin-top: 60pt;
  filter: alpha(opacity=70);  /*设置透明度为60%*/
  opacity: 0.7;  /*非IE浏览器下设置透明度为60%*/
  z-Index: 999;
  -webkit-animation-name: fadeIn; /*动画名称*/
  -webkit-animation-duration: 0.3s; /*动画持续时间*/
  -webkit-animation-iteration-count: 1; /*动画次数*/
}
@-webkit-keyframes fadeIn {
  0% {
    opacity: 0; /*初始状态 透明度为0*/
  }
  100% {
    filter: alpha(opacity=70);  /*结尾状态 透明度为1*/
  }
}
#container {
  z-index: 100;
  padding-bottom: -20pt;
  margin-bottom: -20pt;
  overflow: scroll;
  width: 100%;
  margin: 0 auto;
  margin-top: 70pt;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: start;
}
.chart-item {
  width: 50%;
  height: 10%;
  display: flex;
  flex-flow: column;
  margin-bottom: 20pt;
  img {
    margin: 0 auto;
    width: 5rem;
    height: 5rem;
  }
  span {
    display: block;
    margin-top: 5pt;
    font-size: 13pt;
  }
}
.mint-search {
  height: 44pt !important;
  z-index: 100 !important;
  padding-top: 47pt !important;
  overflow: hidden;
  .mint-searchbar-inner {
    height: 20pt;
    border-radius: 5pt;
    background: #7986B7 !important;
  }
  .mint-searchbar-core {
    background: #7986B7 !important;
    color: #FFFFFF;
    padding-left: 5pt;
  }
  .mint-searchbar {
    height: 44pt;
    padding: 4px 16px;
    background-color: #465295;
  }
  .mint-searchbar-cancel {
    color: #FFFFFF;
    font-size: 10pt;
  }
  .mint-searchbar-inner .mintui-search {
    color: #FFFFFF;
  }
  input::-webkit-input-placeholder {
    padding-left: 5pt;
    color: #FFFFFF;
    font-size: 11pt;
  }
}
.mint-indexlist {
  text-align: left;
}
.mint-indexsection {
  line-height: 7pt;
  p {
    background-color: #f1f1f1;
    font-size: 11pt;
  }
  .mint-cell {
    min-height: 21pt;
    font-size: 10pt;
  }
  .mint-cell-wrapper {
    font-size: 10pt;
  }
}
#showResults {
  width: 100% !important;
  position: relative !important;
}
.resItem {
  width: 100%;
  height: 40pt;
  background: #f7f5f4;
  .resItem-text {
    width: 30%;
    height: 40pt;
    text-align: left;
    margin-left: 10pt;
    line-height: 40pt;
  }
}
.departContainer {
  width: 100% !important;
  height: 100%;
  background-color: #F8F8F8;
  position: absolute !important;
  z-index: 0 !important;
  .chart-depart-item {
    height: 50pt;
    width: 100%;
    background-color: #FFFFFF !important;
    line-height: 50pt;
    text-align: left;
    padding-left: 10pt;
    box-sizing: border-box;
    border-bottom: 0.1pt #D9D9D9 solid;
  }
}
// .haveSelect {
//   background: #EEEFF6;
// }
// .clickDepart {
//   background-color: rgb(224, 228, 241);
// }
.haveScroll {
  position: fixed;
}
.haveShow {
  position: fixed !important;
  overflow: hidden;
}
</style>
