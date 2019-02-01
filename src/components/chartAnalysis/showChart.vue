<template>
  <div class="showChartContainer">
    <mt-header :title="title" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="show-chart-panel" id="panel" ref="panel">
      <div id="chart" ref="chart">
      </div>
      <div class="nochart" v-if="chartData.length === 0 || chartData.length === undefined">
        <img src="@/assets/none.png">
      </div>
      <div class="show-chart-cata">
        <div class="catagray-item">
          <div class="catagray-item-title">
            当前年份：
          </div>
          <div class="catagray-item-value">
            {{currentYear}}
          </div>
          <div class="catagray-item-img" @click="handleYear">
            <img src="@/assets/select1.png">
          </div>
        </div>
        <div class="catagray-item">
          <div class="catagray-item-title">
            当前公司：
          </div>
          <div class="catagray-item-value">
            {{currentCompany}}
          </div>
          <div class="catagray-item-img" @click="handleCompany">
            <img src="@/assets/select1.png">
          </div>
        </div>
        <div class="catagray-item">
          <div class="catagray-item-title">
            当前部门：
          </div>
          <div class="catagray-item-value">
            {{currentDepart}}
          </div>
          <div class="catagray-item-img" @click="handlePart">
            <img src="@/assets/select1.png">
          </div>
        </div>
      </div>
    </div>
    <mt-popup
      v-model="popupYearVisible"
      position="bottom">
      <mt-picker :slots="setYearDataSlot" ref="yearPicker" :show-toolbar="true">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="handleCancel">取消</div>
          <div class="usi-btn-sure" @click="onYearChange">确定</div>
        </div>
      </mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupCompanyVisible"
      position="bottom">
      <mt-picker :slots="setCompanyDataSlot" value-key="comPanyName" :show-toolbar="true" ref="companyPicker">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="handleCancel">取消</div>
          <div class="usi-btn-sure" @click="onCompanyChange">确定</div>
        </div>
      </mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupDepartVisible"
      position="bottom">
      <mt-picker :slots="setDepartDataSlot" value-key="departName" :show-toolbar="true" ref="departPicker">
         <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="handleCancel">取消</div>
          <div class="usi-btn-sure" @click="onDepartChange">确定</div>
        </div>
      </mt-picker>
    </mt-popup>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts')
export default {
  data () {
    return {
      // 头部标题
      title: '',
      // 返回的url
      backUrl: '',
      clientHeight: '',
      clientWidth: '',
      // 图表类型
      type: 'pie',
      // 下部弹框
      popupYearVisible: false,
      popupCompanyVisible: false,
      popupDepartVisible: false,
      selectYears: [],
      selectYearsLen: '',
      currentYear: '',
      selectCompany: [],
      selectCompanyLen: '',
      currentCompany: '',
      defaultCompanyIndex: '',
      selectDepart: [],
      selectDepartLen: '',
      currentDepart: '',
      defaultDepartIndex: '',
      chartData: [],
      codeData: []
    }
  },
  created: function () {
    this.title = this.$store.getters.chartType
    this.backUrl = '/chartAnalysis?userName=' + window.localStorage.getItem('empNum')
    if (this.$store.getters.depart === '') {
      this.getData()
    }
    this.setYear()
    this.setCompany()
    this.getData()
  },
  computed: {
    // 设置选择框年份的值
    setYearDataSlot () {
      let data = [
        {
          flex: 1,
          values: this.selectYears,
          textAlign: 'center'
        }
      ]
      return data
    },
    setCompanyDataSlot () {
      let data = [
        {
          flex: 1,
          values: this.selectCompany,
          defaultIndex: this.defaultCompanyIndex,
          textAlign: 'center'
        }
      ]
      return data
    },
    setDepartDataSlot () {
      let data = [
        {
          flex: 1,
          values: this.selectDepart,
          defaultIndex: this.defaultDepartIndex,
          textAlign: 'center'
        }
      ]
      return data
    }
  },
  methods: {
    getOption (type) {
      let _this = this
      var option = {}
      let barImg = 'path://M977.709589 946.849315h-28.054794V234.257534c0-19.638356-15.430137-35.068493-35.068494-35.068493H737.841096c-19.638356 0-35.068493 15.430137-35.068493 35.068493v712.591781h-63.123288V51.90137c0-19.638356-15.430137-35.068493-35.068493-35.068493H427.835616c-19.638356 0-35.068493 15.430137-35.068493 35.068493v894.947945h-70.136986V396.975342c0-19.638356-15.430137-35.068493-35.068493-35.068493H110.816438c-19.638356 0-35.068493 15.430137-35.068493 35.068493v549.873973H54.706849c-19.638356 0-35.068493 15.430137-35.068493 35.068493s15.430137 35.068493 35.068493 35.068493h924.40548c19.638356 0 35.068493-15.430137 35.068493-35.068493s-16.832877-35.068493-36.471233-35.068493z m-831.824657 0V432.043836H252.493151v514.805479h-106.608219z m317.019178 0V86.969863h106.608219v859.879452H462.90411z m310.005479 0V269.326027h106.608219v677.523288h-106.608219z'
      let pieImg = 'path://M512 55.296C260.096 55.296 55.296 260.096 55.296 512s204.8 456.704 456.704 456.704 456.704-204.8 456.704-456.704S763.904 55.296 512 55.296zM925.696 490.496 559.104 490.496 819.2 230.4C883.712 303.104 921.6 392.192 925.696 490.496zM512 929.792C281.6 929.792 94.208 742.4 94.208 512S281.6 94.208 512 94.208c106.496 0 204.8 43.008 277.504 106.496L494.592 494.592c-4.096 4.096-4.096 8.192-4.096 13.312 0 13.312 8.192 21.504 21.504 21.504l413.696 0C917.504 750.592 734.208 929.792 512 929.792z'
      if (type === 'bar') {
        option = {
          xAxis: {
            type: 'category',
            data: '',
            axisLabel: {
              // 强制文字产生间隔
              interval: 0,
              // 文字逆时针旋转45°
              rotate: 45,
              // 文字样式
              textStyle: {
                fontSize: 11,
                fontFamily: 'Microsoft YaHei'
              }
            }
          },
          yAxis: {
            type: 'value',
            data: ''
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: true,
                optionToContent: function (opt) {
                  var axisData = opt.xAxis[0].data
                  var series = opt.series
                  // var table = '<table style="width:100%;position:absolute;top:60px;left:5px;right:5px;text-align:center;scroll:auto"><tbody><tr style="background: #465295";font-color: #FFFFFF>' +
                  var table = '<table style="width:100%;text-align:center;scroll:auto"><tbody><tr style="background: #465295";font-color: #FFFFFF>' +
                    '<td><font color=white>序号</font></td>' +
                    '<td><font color=white>类别</font></td>' +
                    '<td><font color=white>数量</font></td>' +
                    '</tr>'
                  for (var i = 0, l = axisData.length; i < l; i++) {
                    table += '<tr>' +
                      '<td>' + (i + 1) + '</td>' +
                      '<td>' + axisData[i] + '</td>' +
                      '<td>' + series[0].data[i] + '</td>' +
                      '</tr>'
                  }
                  table += '</tbody></table>'
                  return table
                }
              },
              restore: {
                show: true
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              myTool: {
                show: true,
                title: '切换图表类型',
                icon: pieImg,
                onclick: function () {
                  _this.type = 'pie'
                }
              }
            },
            itemSize: 18,
            itemGap: 16,
            itemWidth: 28,
            itemHeight: 16
          },
          legend: {
            data: ''
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: ''
            }
          ],
          grid: {
            x: '10%',
            x2: '5%'
          },
          color: function (value) {
            return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
          },
          series: [{
            name: '比例',
            type: 'bar',
            data: '',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barWidth: 30, // 柱图宽度
            markLine: {
              data: [
                {
                  type: 'average'
                }
              ]
            }
          }]
        }
      } else if (type === 'pie') {
        option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: true,
                optionToContent: function (opt) {
                  var series = opt.series[0].data
                  // var table = '<table style="width:100%;position:absolute;top:60px;left:5px;right:5px;text-align:center;scroll:auto"><tbody><tr style="background: #465295";font-color: #FFFFFF>' +
                  var table = '<table style="width:100%;text-align:center;scroll:auto"><tbody><tr style="background: #465295";font-color: #FFFFFF>' +
                    '<td><font color=white>序号</font></td>' +
                    '<td><font color=white>类别</font></td>' +
                    '<td><font color=white>数量</font></td>' +
                    '</tr>'
                  for (var i = 0, l = series.length; i < l; i++) {
                    table += '<tr>' +
                      '<td>' + (i + 1) + '</td>' +
                      '<td>' + series[i].name + '</td>' +
                      '<td>' + series[i].value + '</td>' +
                      '</tr>'
                  }
                  table += '</tbody></table>'
                  return table
                }
              },
              restore: {
                show: true
              },
              myBtn: {
                show: true,
                title: '切换图表类型',
                icon: barImg,
                onclick: function () {
                  _this.type = 'bar'
                }
              }
            },
            itemSize: 18,
            itemGap: 16
          },
          legend: {
            x: 'center',
            y: 'bottom',
            type: 'scroll',
            bottom: 20,
            pagemode: true,
            pageButtonPosition: 'end',
            pageButtonGap: 30,
            pageButtonItemGap: 5,
            pageIconSize: 18
          },
          series: [{
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: true,
                formatter: '{b}:{c}',
                textStyle: {
                  fontWeight: 'normal'
                }
              }
            },
            data: '',
            // 设置随机色
            color: function (value) {
              return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
            },
            lineStyle: {
              color: '#465295'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }]
        }
      }
      return option
    },
    handleYear () {
      this.popupYearVisible = true
      // this.$refs.yearPicker.open()
    },
    handleCompany () {
      this.popupCompanyVisible = true
    },
    handlePart () {
      this.popupDepartVisible = true
    },
    // 设置当前屏幕的高度 并绘制比例图
    changeFixed () {
      let _this = this
      this.$refs.chart.style.height = (this.clientHeight * 0.6) + 'px'
      this.$refs.chart.style.width = this.clientWidth + 'px'
      let chart = echarts.init(document.getElementById('chart'))
      // chart.showLoading({
      //   text: '正在努力的读取数据中···'
      // })
      // setTimeout (() => {
      //   chart.closrLoading()
      // }, 500)
      chart.setOption(this.getOption(this.type), true)
      // 为chart添加点击事件
      chart.on('click', function (param) {
        if (_this.type === 'bar') {
          _this.$router.push({
            path: '/listDetail',
            query: {
              listTitle: _this.title,
              listTitleSub: param.name,
              nums: param.value,
              code: _this.codeData[param.dataIndex]
            }
          })
        } else if (_this.type === 'pie') {
          _this.$router.push({
            path: '/listDetail',
            query: {
              listTitle: _this.title,
              listTitleSub: param.data.name,
              nums: param.data.value,
              code: param.data.key
            }
          })
        }
      })
    },
    setYear () {
      let date = new Date()
      let year = date.getFullYear()
      this.currentYear = this.$store.getters.time
      for (var i = 0; i < 30; i++, year--) {
        this.selectYears[i] = year
      }
      this.selectYearsLen = this.selectYears.length
      return this.selectYears
    },
    setCompany () {
      let _this = this
      this.currentCompany = this.$store.getters.company
      let depart = this.$store.getters.depart
      this.selectCompany = this.$store.getters.allCompanys
      this.selectCompanyLen = this.selectCompany.length
      this.selectCompany.forEach((element, index) => {
        if (element.comPanyID === _this.$store.getters.companyId) {
          _this.defaultCompanyIndex = index
        }
        if (_this.currentCompany === element.comPanyName) {
          _this.selectDepart = element.dePart
          _this.selectDepartLen = _this.selectDepart.length
          element.dePart.forEach((item, i) => {
            if (depart === item) {
              _this.currentDepart = item.departName
              _this.defaultDepartIndex = i
            }
          })
        }
      })
      if (this.defaultCompanyIndex === '') {
        _this.defaultCompanyIndex = -1
      }
      if (this.defaultDepartIndex === '') {
        _this.defaultDepartIndex = -1
      }
    },
    setdepart () {
      let _this = this
      let depart = this.$store.getters.depart
      this.selectCompany.forEach((element, index) => {
        if (_this.currentCompany === element.comPanyName) {
          _this.selectDepart = element.dePart
          _this.selectDepartLen = _this.selectDepart.length
          element.dePart.forEach((item, i) => {
            if (depart === item) {
              _this.currentDepart = item.departName
              _this.defaultDepartIndex = i
            }
          })
        }
      })
    },
    handleCancel () {
      this.popupYearVisible = false
      this.popupCompanyVisible = false
      this.popupDepartVisible = false
      this.$refs.yearPicker.close()
    },
    onYearChange () {
      let value = this.$refs.yearPicker.getValues()[0]
      this.popupYearVisible = false
      this.currentYear = value
      this.$store.dispatch('modifyTime', value)
      this.getData()
    },
    onCompanyChange () {
      let value = this.$refs.companyPicker.getValues()[0]
      this.popupCompanyVisible = false
      this.currentCompany = value.comPanyName
      this.$store.dispatch('modifyCompany', value.comPanyName)
      this.$store.dispatch('modifyCompanyId', value.comPanyID)
      if (this.$store.getters.depart === '') {
        this.getData()
      }
    },
    onDepartChange () {
      let value = this.$refs.departPicker.getValues()[0]
      this.popupDepartVisible = false
      this.currentDepart = value.departName
      this.$store.dispatch('modifyDepart', value)
      this.getData()
    },
    changeData (testXData, testYData) {
      let res = []
      testXData.forEach((element, index) => {
        res[index] = {
          name: element,
          value: testYData[index]
        }
      })
      return res
    },
    getData () {
      let url = '/statistics/getData'
      let param = {
        company: this.$store.getters.companyId,
        depart: this.$store.getters.depart === '' ? '' : this.$store.getters.depart.departID,
        time: this.$store.getters.time,
        type: this.$store.getters.chartTypeKey
      }
      let data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(url, data).then(res => {
        if (res.data.code === 200) {
          this.chartData = res.data.data
          if (this.chartData.length === 0) {
            this.$refs.chart.style.display = 'none'
          } else {
            this.$refs.chart.style.display = 'block'
          }
          this.transPie()
        } else {
          this.$messagebox({
            title: '错误',
            message: res.data.msg
          })
        }
      })
    },
    transPie () {
      let pieData = []
      this.chartData.forEach((item, index) => {
        let data = {
          value: '',
          name: '',
          key: ''
        }
        data.value = item.value
        data.name = item.key
        data.key = item.code
        pieData.push(data)
      })
      let chart = echarts.init(document.getElementById('chart'))
      chart.setOption({
        series: [{
          data: pieData
        }]
      })
    },
    transBar () {
      let _this = this
      let xdata = []
      let ydata = []
      this.chartData.forEach((item, index) => {
        _this.codeData[index] = item.code
        ydata[index] = item.value
        xdata[index] = item.key
      })
      let chart = echarts.init(document.getElementById('chart'))
      chart.setOption({
        xAxis: {
          data: xdata
        },
        yAxis: {
          data: ydata
        },
        legend: {
          data: xdata
        },
        series: {
          data: ydata
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: ydata.length > 5 ? 50 : 100
          }
        ]
      })
    }
  },
  beforeMount () {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    var w = document.documentElement.clientWidth || document.body.clientWidth
    // 减去页面上固定高度height
    this.clientHeight = h - 80
    this.clientWidth = w - 10
  },
  watch: {
    clientHeight: function () {
      this.changeFixed()
    },
    type: function (valueType) {
      let chart = echarts.init(document.getElementById('chart'))
      // 设置option为true，不合并option值，每次都是重新赋值
      chart.setOption(this.getOption(valueType), true)
      if (valueType === 'bar') {
        this.transBar()
      } else if (valueType === 'pie') {
        this.transPie()
      }
    },
    currentCompany: function (value) {
      this.setdepart()
    }
  }
}
</script>
<style lang="less">
.show-chart-panel {
  width: 100%;
  margin-top: 50pt;
  .show-chart-cata {
    width: 100%;
    margin-top: 20pt;
  }
  .nochart {
    width: 100%;
    height: 100%;
    margin-top: 50%;
    img {
      width: 80%;
      height: 80%;
    }
  }
}
.catagray-item {
  width: 100%;
  height: 30pt;
  float: left;
  border-bottom: 1pt solid #ebe7e7;
  .catagray-item-title {
    width: 30%;
    float: left;
    text-align: left;
    padding-left: 10pt;
    padding-top: 12pt;
    font-size: 11pt;
    color: #98A1AB
  }
  .catagray-item-value {
    width: 55%;
    float: left;
    text-align: right;
    padding-top: 12pt;
    font-size: 11pt;
    color: #282828;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .catagray-item-img {
    width: 9%;
    height: 100%;
    float: right;
    img {
      width: 10pt;
      margin-top: 16pt;
      margin-left: 0pt;
      color: #282828
    }
  }
}
#chart {
  width: 100%;
}
.popup {
  width: 80rem;
  height: 200pt;
  overflow:auto;
}
.pickBtnCancel {
  font-size: 13pt !important;
  width: 20% !important;
  float: left !important;
  margin-left: 20%;
  margin-top: 10pt !important;
  border: none;
  color: #465295 !important;
  background-color: white !important;
}
.pickBtnConfirm {
  font-size: 13pt !important;
  width: 20% !important;
  float: right !important;
  margin-top: 10pt !important;
  border: none;
  color: red !important;
  background-color: white !important;
  margin-right: 20%;
}
.mint-popup {
  width: 100%;
  border-radius: 5pt 5pt 0pt 0pt;
}
.picker-items {
  width: 90%;
  margin: 0 auto;
}
textarea {
  width: 97% !important;
  height: 97% !important;
}
.picker-toolbar-title {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: black;
}
.usi-btn-cancel, .usi-btn-sure {
  color: #465295
}
.picker-slot-wrapper {
  overflow-y: scroll !important
}
.picker-toolbar {
  height: 40px;
}
</style>
