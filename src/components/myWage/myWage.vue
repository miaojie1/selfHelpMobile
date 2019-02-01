<template>
  <div>
    <mt-header title="我的薪酬" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="handleBack">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="wage_header_content">
      <span class="wage_name_span" v-if="username === '' || username === null">暂无</span>
      <span class="wage_name_span">{{username}}</span>
      <span v-if="userPart === '' || userPart === null" class="wage_part_span">暂无部门信息</span>
      <span v-else class="wage_part_span">{{userPart}}</span>
    </div>
    <div class="wage_date_div">
      <div @click="openDatePicker" class="wage_date_div_time">
        {{currentYear}}-{{currentMonth}}
      </div>
      <div class="wage_date_div_img">
        <img src="@/assets/g3.png" @click="openDatePicker"/>
      </div>
    </div>
    <div class="noDataDiv" v-if="content === '' || content === null">
      <img src="@/assets/none.png">
      <p>暂时没有数据哦~</p>
    </div>
    <div v-else class="wage_body_content">
      <div class="wage_card_top">
        <!-- 如果工资条数大于1，则显示导航栏 -->
        <mt-navbar v-if="wageLength > 1" v-model="selected">
          <mt-tab-item v-for="(item,index) in content" :id="index+1" :key="index+1">工资卡{{index+1}}</mt-tab-item>
        </mt-navbar>
        <!-- 如果不是，不显示导航栏，循环cell -->
        <mt-cell v-else v-for="(n,m) in keyText[1]" :title="n" align="left" :key="n">{{keyValue[1][m]}}</mt-cell>
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <mt-tab-container-item v-for="(item,index) in content" :id="index+1" :key="index+1">
            <mt-cell v-for="(n,m) in keyText[index]" :title="n" align="left" :key="n">{{keyValue[index][m]}}</mt-cell>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <div class="wage_card_mid">
        <span>最近三个月工资比例图</span>
      </div>
      <div class="wage_card_bottom" id="myChart" v-show="isShow">
      </div>
      <div class="wage_card_bottom" v-show="!isShow">
        <div class="noDataDiv-wage">
          <img src="@/assets/none.png">
          <p>暂时没有工资单哦~</p>
        </div>
      </div>
    </div>
    <mt-datetime-picker
      ref="datePicker"
      v-model="selectedDate"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="changeDate">
    </mt-datetime-picker>
  </div>
</template>
<script>
import noData from '@/components/common/noData'
let echarts = require('echarts/lib/echarts')
require('echarts')
export default{
  data () {
    return {
      username: '',
      userPart: '',
      // 当前选中的年份 用于时间选择器
      currentYear: '',
      // 当前选中的月份 用于时间选择器
      currentMonth: '',
      // 图表工资月份
      month_echarts: [],
      // 图表工资
      wageValue: [],
      // 工资条数，，根据工资条数来判断是否显示选项卡
      wageLength: '',
      // 暂存 工资数额 将接口返回的数据保存在3个数组中
      keyValue: [],
      // 暂存 工资key
      key: [],
      // 暂存 工资名称
      keyText: [],
      // 当前日期
      selectedDate: new Date(),
      // 选项卡默认选择id为1的
      selected: 1,
      // 工资日子
      date: '',
      // 用于保存接口返回的所有工资的值
      content: [],
      // 用于保存接口返回的所有的key值
      contentKey: [],
      isShow: false
    }
  },
  created: function () {
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    this.getInfor()
    // 初始化当前的日期
    let date = new Date()
    this.currentYear = date.getFullYear()
    this.currentMonth = date.getMonth() + 1
    if (this.currentMonth < 10) {
      this.currentMonth = '0' + this.currentMonth
    }
    // 初始化工资的日期
    this.date = this.currentYear + '' + this.currentMonth
    // 初始化图标的日期
    this.initMon(this.currentYear, this.currentMonth)
    // 获取用户工资
    this.getUserWage(this.date)
    // 循环获取3月份工资
    for (var i = 0; i < 3; i++) {
      let date = this.month_echarts[i]
      this.initWage(date, i)
    }
  },
  mounted: function () {
    let myChart = document.getElementById('myChart')
    // 初始化echarts图渲染时的dom
    this.initBox(myChart, 0.9, 0.5)
    // this.drawLine()
  },
  methods: {
    // 打开日期选择器
    openDatePicker () {
      this.$refs.datePicker.open()
    },
    // 格式化日期选择器获取的时间,并赋值给当前日期
    formatPickerDate (date) {
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      this.currentYear = y
      this.currentMonth = m
      return y + ' ' + m + ' ' + d
    },
    // 日期选择器点击确定后触发
    changeDate () {
      // 格式化日期选择器
      this.formatPickerDate(this.selectedDate)
      // 格式化“当前年”“当前月”用于日期选择部分显示
      this.initMon(this.currentYear, this.currentMonth)
      // 加载选择日期的工资
      this.getUserWage(this.currentYear + '' + this.currentMonth)
      // 循环获取3月份工资
      for (var i = 0; i < 3; i++) {
        let date = this.month_echarts[i]
        this.initWage(date, i)
      }
      // 重新绘制
      this.drawLine()
    },
    // 参数1：dom的标识，参数2：dom宽占屏幕的百分比，参数3：dom高占屏幕的百分比
    initBox (domName, wPer, hPer) {
      this.width = window.innerWidth
      this.height = window.innerHeight
      domName.style.width = this.width * wPer + 'px'
      domName.style.height = this.height * hPer + 'px'
    },
    // 初始化工资月份数组，用于图标的显示
    initMon (year, mon) {
      var d = new Date(year, mon)
      // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
      for (let i = 0, j = 2; i < 3; i++, j--) {
        d.setMonth((d.getMonth() - 1))
        var yy1 = d.getFullYear()
        var mm1 = d.getMonth() + 1
        if (mm1 < 10) {
          mm1 = '0' + mm1
        }
        this.month_echarts[j] = yy1 + '' + mm1
      }
    },
    initWage (date, i) {
      let wageUrl = '/salary/getsalary'
      let param = {
        date: date,
        empNum: this.$store.getters.missionEmpNum
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(wageUrl, data).then((val) => {
        if (val.data.code === 200) {
          if (typeof (val.data.data.allMoney) !== 'undefined') {
            this.wageValue[i] = val.data.data.allMoney
          } else {
            this.wageValue[i] = 0
          }
          this.drawLine()
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.msg
          })
        }
      }).catch(err => {
        this.$messagebox({
          title: '错误',
          message: err.data
        })
      })
    },
    // 获取工资，格式化成3个数组，方便解析显示
    setWage () {
      let length = this.content.length
      this.key.length = length
      this.keyText.length = length
      this.keyValue.length = length
      for (let j = 0; j < length; j++) {
        let contents = this.contentKey[j]
        let values = this.content[j]
        // 暂存key，，最后赋值给key数组
        let keys = []
        let keysText = []
        let keysValue = []
        for (let i = 0; i < contents.length; i++) {
          // 将工资key，工资名称依次取出存入暂存数组
          keys[i] = contents[i].key
          keysText[i] = contents[i].title
          keysValue[i] = values[keys[i]]
        }
        // 将内容放入对应的数组[i]中
        this.key[j] = keys
        this.keyText[j] = keysText
        this.keyValue[j] = keysValue
      }
    },
    // 画条形图
    drawLine () {
      var _this = this
      let myChart = document.getElementById('myChart')
      let myCharts = echarts.init(myChart)
      myCharts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          riggerEvent: true,
          triggerEvent: true,
          data: _this.month_echarts
        }],
        yAxis: [{
          type: 'value',
          riggerEvent: true,
          axisLabel: {
            textStyle: {
              fontSize: 9
            }
          }
        }],
        grid: [{
          x: '15%',
          width: '70%'
        }],
        series: [
          {
            name: '工资',
            type: 'bar',
            data: _this.wageValue,
            itemStyle: {
              normal: {
                // 每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                  var colorList = [
                    ['rgb(133, 16, 151)', 'rgb(127, 67, 206)', 'rgb(73, 4, 83)'],
                    ['rgb(187, 66, 6)', '#FB7915', '#F9661E'],
                    ['#2d8560', '#3ebe89', 'rgb(5, 168, 87)']
                  ]
                  var index = params.dataIndex
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length
                  }
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1,
                    [
                      {offset: 0, color: colorList[index][0]},
                      {offset: 0.5, color: colorList[index][1]},
                      {offset: 1, color: colorList[index][2]}
                    ])
                }
              }
            },
            barWidth: 30, // 柱图宽度
            markPoint: {
              data: [
                {
                  type: 'max'
                },
                {
                  type: 'min'
                }
              ]
            },
            markLine: {
              data: [
                {
                  type: 'average'
                }
              ]
            }
          }
        ]
      }, true)
      // 防止重复事件
      myCharts.off('click')
      myCharts.on('click', function (value) {
        if (value.componentType === 'xAxis') {
          _this.currentYear = (value.value).substring(0, 4)
          _this.currentMonth = (value.value).substring(4, 7)
          _this.getUserWage(value.value)
        } else {
          _this.currentYear = (value.name).substring(0, 4)
          _this.currentMonth = (value.name).substring(4, 7)
          _this.getUserWage(value.name)
        }
      })
    },
    // 根据日期获取用户薪资
    getUserWage (dateVal) {
      let _this = this
      _this.content = []
      _this.contentKey = []
      let wageUrl = '/salary/getsalary'
      var param = {
        date: dateVal,
        empNum: this.$store.getters.missionEmpNum
      }
      var data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(wageUrl, data).then((val) => {
        if (val.data.code === 200) {
          val.data.data.content.map(function (item) {
            if (JSON.stringify(item) !== '{}') {
              _this.content.push(item)
            }
          })
          val.data.data.contentKey.map(function (item) {
            if (JSON.stringify(item) !== '[]') {
              _this.contentKey.push(item)
            }
          })
          this.wageLength = this.content.length
          if (this.wageLength === 0 || JSON.stringify(this.content[0]) === '{}') {
            this.isShow = false
            if (this.wageLength > 0) {
              this.isShow = true
            }
          } else {
            this.isShow = true
          }
          this.setWage()
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.msg
          })
        }
      }).catch(err => {
        this.$messagebox({
          title: '错误',
          message: err.date
        })
      })
    },
    // 获取用户姓名以及部门信息
    getInfor () {
      let getInforUrl = '/personal/info'
      let params = {
        empNum: this.$store.getters.missionEmpNum
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(getInforUrl, data).then((val) => {
        if (val.data.code === 200) {
          this.username = val.data.data.content.H_HU_NAME
          this.userPart = val.data.data.content.H_OR_BMMC
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.msg
          })
        }
      }).catch(err => {
        this.$messagebox({
          title: '错误',
          message: err.data
        })
      })
    },
    handleBack () {
      this.$store.commit('back', window.localStorage.getItem('mobileType'))
    }
  },
  components: {
    noData
  }
}
</script>
<style lang="less">
  body{
    margin: 0px !important;
    background-color: #F8F8F8;
  }
  .mint-cell-wrapper {
    font-size: 11pt;
  }
  .mint-tab-item-label {
    font-size: 11pt;
  }
  .wage_header_content{
    width: 100%;
    height: 100pt;
    background-color: #465295;
    margin-top: 55px;
    display: flex;
    flex-flow: column;
    color: #FFFFFF;
  }
  .wage_header_content span{
    width: 100%;
  }
  .wage_name_span{
    padding-top: 13pt;
    font-size: 18pt;
    line-height: 24pt;
  }
  .wage_part_span{
    padding-top: 10pt;
    font-size: 11pt;
    line-height: 19pt;
  }
  .wage_date_div{
    background-color: #FFFFFF;
    width: 90%;
    height: 44pt;
    margin: 0 auto;
    position: relative;
    top: -20pt;
    border-bottom: rgb(214, 217, 221) 1pt solid;
    display: flex;
    flex-flow: row;
    justify-content: center;
    .wage_date_div_time {
      width: 30%;
      color: #178FFF;
      font-size: 16pt;
      line-height: 44pt;
    }
    .wage_date_div_img {
      width: 10%;
      height: 18pt;
      line-height: 44pt;
      img {
        width: 20pt;
        height: 18pt;
        line-height: 20pt;
        padding-top: 12pt;
      }
    }
  }
  // .wage_date_div span{
  //   color: #178FFF;
  //   font-size: 16pt;
  //   margin: 0 auto;
  //   line-height: 40pt;
  // }
  // .wage_date_div img{
  //   width: 20pt;
  //   height: 18pt;
  //   line-height: 20pt;
  //   padding-left: 8pt;
  // }
  .wage_body_content{
    width: 90%;
    margin: 0 auto;
    margin-top: -20pt;
    background-color: #F8F8F8;
  }
  .wage_card_top{
    width: 100%;
    height: fit-content;
    background-color: #FFFFFF;
    margin: 0 auto;
  }
  .wage_card_top ul{
    margin-left: -15pt;
  }
  .wage_card_top li{
    widows: 100%;
    height: 35pt;
    line-height: 27pt;
    margin-left: 10pt;
    border-bottom: rgb(214, 217, 221) 1pt solid;
  }
  .text_span{
    color: #353A41;
    float: left;
    padding-top: 3pt;
  }
  .value_span{
    color: #EE5A55;
    padding-top: 3pt;
    padding-right: 10pt;
    float: right;
  }
  .wage_card_mid{
    width: 90%;
    height: 30pt;
    margin: 0 auto;
  }
  .wage_card_mid span{
    float: left;
    margin-top: 6pt;
    margin-left: -3%;
  }
  .wage_card_bottom{
    width: 100%;
    background-color:#FFFFFF;
    margin: 0 auto;
    margin-bottom: 20pt;
  }
  .noDataDiv-wage {
    width: 100%;
    height: 200pt;
    margin: 0 auto;
    // position: absolute;
    // top: 50%;
    // transform: translate(0, -50%);
    background-color:#F8F8F8;
    img {
      width: 65%;
      margin-top: 20pt;
    }
    p {
      margin-top: 0pt;
      font-size: 11pt;
    }
  }
</style>
