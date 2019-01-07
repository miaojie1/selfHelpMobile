<template>
  <div class="showChartContainer">
    <mt-header :title="title" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="show-chart-panel" id="panel" ref="panel">
      <div id="chart" ref="chart"></div>
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
      <mt-picker :slots="setYearDataSlot" @change="onYearChange">
      </mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupCompanyVisible"
      position="bottom">
      <mt-picker :slots="setCompanyDataSlot" @change="onCompanyChange">
      </mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupDepartVisible"
      position="bottom">
      <mt-picker :slots="setDepartDataSlot" @change="onDepartChange">
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
      // 判断当前是那种比例图，薪资/性别···
      type: '',
      // 下部弹框
      popupYearVisible: false,
      popupCompanyVisible: false,
      popupDepartVisible: false,
      selectYears: [],
      currentYear: '',
      selectCompany: [],
      currentCompany: '',
      defaultCompanyIndex: '',
      selectDepart: [],
      currentDepart: '',
      defaultDepartIndex: '',
      renyuanDataList: [20, 40, 60, 10, 70, 30],
      renyuanData: [
        {value: 80, name: '开发'},
        {value: 20, name: '测试'},
        {value: 10, name: '方案'},
        {value: 40, name: '设计'},
        {value: 20, name: '销售'},
        {value: 100, name: '实施'}
      ],
      xueliData: [
        {value: 100, name: '大专'},
        {value: 150, name: '本科'},
        {value: 120, name: '硕士'},
        {value: 80, name: '博士'}
      ],
      xinziData: [
        {value: 150, name: '<4k'},
        {value: 310, name: '4k-5k'},
        {value: 274, name: '5k-6k'},
        {value: 235, name: '7k-9k'},
        {value: 400, name: '>9k'}
      ]
    }
  },
  created: function () {
    this.title = this.$route.query.chartTitle + '比例'
    this.type = this.$route.query.chartTitle
    this.backUrl = '/chartList'
    this.setYear()
    this.setCompany()
    this.setdepart()
  },
  computed: {
    // 设置选择框年份的值
    setYearDataSlot () {
      let data = [
        {
          flex: 1,
          values: this.selectYears,
          className: 'slot1',
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
          className: 'slot1',
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
          className: 'slot1',
          textAlign: 'center'
        }
      ]
      return data
    }
  },
  methods: {
    // 人员比例图
    drawRenYuan () {
      let chart = echarts.init(document.getElementById('chart'))
      var option = {
        tooltip: {},
        xAxis: {
          data: ['开发', '测试', '方案', '设计', '销售', '实施']
        },
        yAxis: {},
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              type: 'png'
            }
          }
        },
        legend: {
          data: ['开发', '测试', '方案', '设计', '销售', '实施']
        },
        color: function (value) {
          return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
        },
        series: [{
          name: '人员比例',
          type: 'bar',
          data: this.renyuanDataList,
          barWidth: 30, // 柱图宽度
          markPoint: {
            symbolSize: 35,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: '#fff' // 气泡中字体颜色
                }
              }
            },
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
        }]
      }
      chart.setOption(option)
    },
    // 性别比例图
    drawXingBie () {
      let chart = echarts.init(document.getElementById('chart'))
      var option = {
        title: {
          text: '男女比例图',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              type: 'png'
            }
          }
        },
        series: [
          {
            name: '男女比例',
            type: 'pie',
            radius: '55%',
            // radius: ['30%', '60%'],
            center: ['50%', '55%'],
            data: [
              {value: 650, name: '男'},
              {value: 259, name: '女'}
            ]
          }
        ],
        color: function (value) {
          return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
        }
      }
      chart.setOption(option)
    },
    // 学历比例图
    drawXueLi () {
      let chart = echarts.init(document.getElementById('chart'))
      var option = {
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
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              type: 'png'
            }
          }
        },
        legend: {
          x: 'center',
          y: 'bottom'
        },
        // color: ['rgb(236, 112, 107)', 'rgb(236, 112, 107)', 'rgb(198, 53, 49)', 'rgb(167, 45, 41)'],
        color: function (value) {
          return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
        },
        series: [{
          name: '学历比例',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['50%', '50%'],
          data: this.xueliData.sort(function (a, b) { return a.value - b.value }),
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          }
        }]
      }
      chart.setOption(option)
    },
    // 薪资比例图
    drawXinZi () {
      let chart = echarts.init(document.getElementById('chart'))
      var option = {
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
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              type: 'png'
            }
          }
        },
        legend: {
          x: 'center',
          y: 'bottom'
        },
        series: [{
          name: '薪资比例',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['50%', '50%'],
          data: this.xinziData.sort(function (a, b) { return a.value - b.value }),
          // 南丁格尔玫瑰图
          // roseType: 'radius',
          color: function (value) {
            return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          }
        }]
      }
      chart.setOption(option)
    },
    handleYear () {
      this.popupYearVisible = true
    },
    handleCompany () {
      this.popupCompanyVisible = true
    },
    handlePart () {
      this.popupDepartVisible = true
    },
    // 设置当前屏幕的高度 并绘制比例图
    changeFixed (clientHeight) {
      this.$refs.panel.style.height = clientHeight + 'px'
      this.$refs.chart.style.height = (clientHeight * 0.6) + 'px'
      if (this.type === '人员') {
        this.drawRenYuan()
      } else if (this.type === '性别') {
        this.drawXingBie()
      } else if (this.type === '学历') {
        this.drawXueLi()
      } else if (this.type === '薪资') {
        this.drawXinZi()
      }
    },
    setYear () {
      let date = new Date()
      let year = date.getFullYear()
      this.currentYear = year
      for (var i = 0; i < 30; i++, year--) {
        this.selectYears[i] = year
      }
      return this.selectYears
    },
    setCompany () {
      this.currentCompany = this.$store.getters.company
      this.selectCompany = ['普联软件股份有限公司', '分公司一', '分公司二']
      this.selectCompany.forEach((element, index) => {
        if (element === this.currentCompany) {
          this.defaultCompanyIndex = index
        }
      })
      if (this.defaultCompanyIndex === '') {
        this.defaultCompanyIndex = -1
      }
    },
    setdepart () {
      this.currentDepart = this.$store.getters.depart
      this.selectDepart = ['HR事业部', '石油事业部', '平台研发部', '政务事业部', '整体']
      if (this.$store.getters.depart === '') {
        this.currentDepart = '整体'
        this.defaultDepartIndex = 4
      } else {
        this.selectDepart.forEach((element, index) => {
          if (element === this.currentDepart) {
            this.defaultDepartIndex = index
          }
        })
        if (this.defaultDepartIndex === '') {
          this.defaultDepartIndex = -1
        }
      }
    },
    handleConfirm () {
      this.popupYearVisible = false
    },
    handleCancel () {
      this.popupYearVisible = false
    },
    onYearChange (picker, values) {
      this.currentYear = values[0]
    },
    onCompanyChange (picker, values) {
      this.currentCompany = values[0]
    },
    onDepartChange (picker, values) {
      this.currentDepart = values[0]
    }
  },
  beforeMount () {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    // 减去页面上固定高度height
    this.clientHeight = h - 80
  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
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
.picker-toolbar {
  height: 0pt;
}
textarea {
  width: 96% !important;
  height: 96% !important;
}
</style>
