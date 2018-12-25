<template>
  <div>
    <div id="header">
      <div class="company-list-back" @click="handleBack">
        <img src="@/assets/left1.png"/>
        <span>返回</span>
      </div>
      <!-- 头部下拉框 -->
      <div class="select-body">
        <input type="text" v-model="selectValue" readonly @click="showList"/>
        <img src="@/assets/down.png" @click="showList">
      </div>
      <div class="chart-btn" @click="showChart">
        <img src="@/assets/chartAn.png">
      </div>
    </div>
    <!-- 下拉列表 -->
    <div class="select-list-panel" v-show="isShow">
      <ul>
        <li v-for="(item, index) in company" :key="index" @click="closeList(item.label, item.value)" :class="{haveSelect: selectValue === item.label}">
          <span>{{item.label}}</span>
          <div class="line"></div>
        </li>
      </ul>
    </div>
    <!-- 页面的遮罩层 -->
    <div id="cover" v-show="isShow" @click="closeList"></div>
    <div id="container" :class="{haveScroll: isShow}">
      <mt-search
        v-model="searchValue"
        :result.sync="results"
        cancel-text="取消"
        placeholder="搜索">
      </mt-search>
      <!-- 搜索框及时显示 -->
      <div id="showResults" v-show="resultsPanel">
        <div class="resItem" v-show="resultsPanel" v-for="(item, index) in results" :key="index" @click="goToDepart(item.label)">
          <div class="resItem-text">
            {{item.label}}
          </div>
          <img src="@/assets/chart-circle.png" class="li-chartImg">
        </div>
      </div>
      <!-- <div class="departContainer">
        <ul>
          <li v-for="(item, index) in depart" :key="index" @click="goToDepart(item.label)">
            <img src="@/assets/depart.png" class="li-depart-img">
            <span>{{item.label}}</span>
            <img src="@/assets/chart-renyuan.png" class="li-chartImg">
            <img src="@/assets/chart-circle.png" class="li-chartImg">
          </li>
        </ul>
      </div> -->
      <div class="departContainer">
        <ul v-for="(depart, index) in companyList1" :key="index">
          <div class="ul-title" @click="goToDepart(item.label)">
            {{depart.depart}}
          </div>
          <li v-for="(item, index) in depart.emp" :key="index">
            <span>{{item.empName}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      modal_loading: false,
      questionImageIsShow: false,
      resultsPanel: false,
      results: [],
      company: [
        {
          value: '0',
          label: '普联软件股份有限公司'
        },
        {
          value: '1',
          label: '普联分公司一有限公司有限公司'
        },
        {
          value: '2',
          label: '分公司二'
        },
        {
          value: '3',
          label: '分公司三'
        }
      ],
      depart: [
        {
          value: '0',
          label: 'HR事业部'
        },
        {
          value: '1',
          label: '石油事业部'
        },
        {
          value: '2',
          label: '油气事业部'
        },
        {
          value: '3',
          label: '政务事业部'
        },
        {
          value: '4',
          label: '平台研发部'
        }
      ],
      // 下拉框绑定的值
      selectValue: '',
      // 搜索框绑定的值
      searchValue: '',
      // 控制下拉框是否显示
      isShow: false,
      showCompanyList: '',
      companyList1: [
        {
          depart: 'HR事业部1',
          departId: '1',
          index: 'HR',
          emp: [
            {
              empNum: '00011',
              empName: '张三1'
            },
            {
              empNum: '00012',
              empName: '张三2'
            },
            {
              empNum: '00013',
              empName: '张三3'
            },
            {
              empNum: '00014',
              empName: '张三4'
            }
          ]
        },
        {
          depart: '产品研发部',
          departId: '2',
          index: '产品',
          emp: [
            {
              empNum: '00011',
              empName: '李三1'
            },
            {
              empNum: '00012',
              empName: '李三2'
            },
            {
              empNum: '00013',
              empName: '李三3'
            },
            {
              empNum: '00014',
              empName: '李三4'
            }
          ]
        },
        {
          depart: '石油事业部',
          departId: '3',
          index: '石油',
          emp: [
            {
              empNum: '00011',
              empName: '张三1'
            },
            {
              empNum: '00012',
              empName: '张三2'
            },
            {
              empNum: '00013',
              empName: '张三3'
            },
            {
              empNum: '00014',
              empName: '张三4'
            }
          ]
        },
        {
          depart: '测试研发部',
          departId: '4',
          index: '测试',
          emp: [
            {
              empNum: '00011',
              empName: '李三1'
            },
            {
              empNum: '00012',
              empName: '李三2'
            },
            {
              empNum: '00013',
              empName: '李三3'
            },
            {
              empNum: '00014',
              empName: '李三4'
            }
          ]
        }
      ],
      companyList2: [
        {
          depart: 'HR事业部2',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '张三1'
            },
            {
              empNum: '00012',
              empName: '张三2'
            },
            {
              empNum: '00013',
              empName: '张三3'
            },
            {
              empNum: '00014',
              empName: '张三4'
            }
          ]
        },
        {
          depart: '产品研发部',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '李三1'
            },
            {
              empNum: '00012',
              empName: '李三2'
            },
            {
              empNum: '00013',
              empName: '李三3'
            },
            {
              empNum: '00014',
              empName: '李三4'
            }
          ]
        },
        {
          depart: 'HR事业部',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '张三1'
            },
            {
              empNum: '00012',
              empName: '张三2'
            },
            {
              empNum: '00013',
              empName: '张三3'
            },
            {
              empNum: '00014',
              empName: '张三4'
            }
          ]
        },
        {
          depart: '产品研发部',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '李三1'
            },
            {
              empNum: '00012',
              empName: '李三2'
            },
            {
              empNum: '00013',
              empName: '李三3'
            },
            {
              empNum: '00014',
              empName: '李三4'
            }
          ]
        }
      ],
      companyList3: [
        {
          depart: 'HR事业部3',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '张三1'
            },
            {
              empNum: '00012',
              empName: '张三2'
            },
            {
              empNum: '00013',
              empName: '张三3'
            },
            {
              empNum: '00014',
              empName: '张三4'
            }
          ]
        },
        {
          depart: '产品研发部',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '李三1'
            },
            {
              empNum: '00012',
              empName: '李三2'
            },
            {
              empNum: '00013',
              empName: '李三3'
            },
            {
              empNum: '00014',
              empName: '李三4'
            }
          ]
        },
        {
          depart: 'HR事业部',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '张三1'
            },
            {
              empNum: '00012',
              empName: '张三2'
            },
            {
              empNum: '00013',
              empName: '张三3'
            },
            {
              empNum: '00014',
              empName: '张三4'
            }
          ]
        },
        {
          depart: '产品研发部',
          departId: '1',
          emp: [
            {
              empNum: '00011',
              empName: '李三1'
            },
            {
              empNum: '00012',
              empName: '李三2'
            },
            {
              empNum: '00013',
              empName: '李三3'
            },
            {
              empNum: '00014',
              empName: '李三4'
            }
          ]
        }
      ],
      chartVisible: false,
      clientHeight: ''
    }
  },
  created () {
    // this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    // window.localStorage.setItem('empNum', this.$route.getters.missionEmpNum)
    this.selectValue = this.company[0].label
    this.showCompanyList = this.companyList1
  },
  methods: {
    showList () {
      this.isShow = true
    },
    closeList (value, id) {
      if (typeof value === 'string') {
        this.isShow = false
        this.selectValue = value
        if (id === '1') {
          this.showCompanyList = this.companyList1
        } else if (id === '2') {
          this.showCompanyList = this.companyList2
        } else if (id === '3') {
          this.showCompanyList = this.companyList3
        } else if (id === '0') {
          this.showCompanyList = this.companyList1
        }
      } else {
        this.isShow = false
      }
    },
    handleDepart (value) {
      console.log('点击部门' + value)
    },
    showChart () {
      this.$router.push({
        path: '/chartList'
      })
      // this.chartVisible = true
    },
    handleBack () {
      this.$router.push({
        path: '/index',
        query: {
          userName: this.$store.getters.missionEmpNum
        }
      })
    },
    goToDepart (value) {
      this.searchValue = ''
      this.resultsPanel = false
      this.$router.push({
        path: '/chartList'
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
          // this.$pinyin.match(element, value)
          if (reg.test(element.label)) {
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
  margin-top: 0pt;
  position: fixed;
  z-index: 100;
  .chart-btn {
    width: 15%;
    float: right;
    color: white;
    margin-top: 20pt;
    font-size: 12pt;
    img {
      width: 50%;
      height: 50%;
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
  z-index: 999999;
  position: absolute;
  background-color: white;
  margin-top: 48pt;
  span {
    display: block;
    width: 90%;
    margin-left: 5pt;
  }
  ul {
    margin: 0pt;
    padding-left: 0pt;
  }
  li {
    width: 100%;
    margin: 0 auto;
    list-style-type: none;
    text-align: left;
    height: 36pt;
    line-height: 36pt;
    font-size: 12pt;
    padding-left: 10pt;
    .line {
      width: 93%;
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
  height: 100%;;
  // background-color: #465295 !important
}
.chartField {
  position: fixed;
  bottom: 0pt;
  width: 100%;
  height: 20pt;
  background-color: #465295
}
.mint-search {
  height: 40px !important;
  z-index: 100 !important;
  padding-top: 48pt !important;
  overflow: hidden;
  .mint-searchbar-inner {
    height: 16pt;
  }
  .mint-searchbar {
    padding: 4px 6px;
  }
  .mint-searchbar-cancel {
    color: white;
    font-size: 10pt;
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
.resItem {
  width: 99%;
  height: 30pt;
  background: #f1f1f1;
  float: left;
  height: 100%;
  padding-top: 10pt;
  .resItem-text {
    width: 30%;
    float: left;
  }
  img {
    width: 10%;
    float: right;
  }
}
.departContainer {
  width: 96% !important;
  position: absolute !important;
  z-index: 0 !important;
  ul {
    margin: 0pt 0pt;
    padding: 0pt;
    .ul-title {
      width: 100%;
      height: 28pt;
      line-height: 28pt;
      text-align: left;
      background: #EBEBEB;
      padding-left: 10pt;
      color: #000000;
    }
  }
  li {
    margin: 0pt;
    list-style: none;
    height: 30pt;
    text-align: left;
    margin-left: -5pt;
    padding-left: 10pt;
    line-height: 29pt;
    border-bottom: 0.5pt #D9D9D9 solid;
    span {
      width: 60%;
      display: block;
      float: left;
      padding-top: 1pt;
      margin-left: 5pt;
    }
  }
  .li-depart-img {
    width: 15pt;
    height: 15pt;
    float: left;
    margin-top: 1pt;
  }
  .li-chartImg {
    width: 20pt;
    height: 20pt;
    float: right;
    margin-right: 12pt;
  }
}
#showResults {
  width: 100% !important;
  position: relative !important;
  z-index: 2000 !important;
}
.haveSelect {
  background: #EEEFF6;
}
.haveScroll {
  position: fixed;
}
</style>
