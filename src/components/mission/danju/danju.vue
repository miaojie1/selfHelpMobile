<template>
  <div class="danju-container" ref="danJuContainer">
    <mt-header title="我的单据" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="handleBack">返回</mt-button>
      </router-link>
    </mt-header>
    <div style="width: 100%; height: 100pt;" v-show="show">
      <div style="width: 10%; margin:0 auto; margin-top: 200pt">
        <mt-spinner :size="30" type="fading-circle" style="margin:0 auto;"></mt-spinner>
      </div>
    </div>
    <div v-if="danjuData.length === 0 && show === false">
      <no-data title='单据'></no-data>
    </div>
    <div class="danju_listContent" v-else>
      <div class="danju_contentItem">
        <div v-for="(n, index) in danjuData" :key="index" class="danju_item" @click="handleDanJuItem(n)">
          <div class="item_text">
            <div class="span1">{{n.title}}</div>
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
import { mapGetters } from 'vuex'
import noData from '@/components/common/noData'
export default {
  data () {
    return {
      danjuData: [],
      show: true,
      clientHeight: ''
    }
  },
  created: function () {
    this.$store.dispatch('modifyMissionEmpNum', this.$route.query.userName)
    this.getDanjuData()
  },
  methods: {
    handleDanJuItem (val) {
      this.$store.dispatch('modifyTitle', val.head_title)
      this.$store.dispatch('modifyTypeDjbh', val.type_djbh)
      this.$store.dispatch('modifyDjbh', val.djbh)
      this.$router.push({
        path: '/danjuListHead'
      })
    },
    getDanjuData () {
      let url = '/process/myInvoices'
      let params = {
        empNum: this.$store.getters.missionEmpNum
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(url, data).then((val) => {
        if (val.data.code === 200) {
          this.danjuData = val.data.data.data
          this.show = false
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.code
          })
          this.show = false
        }
      }).catch((err) => {
        this.$messagebox({
          title: '错误',
          message: err
        })
        this.show = false
      })
    },
    changeFixed (clientHeight) {
      this.$refs.inforContainer.style.height = clientHeight + 'px'
    },
    handleBack () {
      this.$store.commit('back', window.localStorage.getItem('mobileType'))
    }
  },
  beforeMount () {
    var h = document.documentElement.clientHeight || document.body.clientHeight
    // 减去页面上固定高度height
    this.clientHeight = h
  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  computed: {
    ...mapGetters([
      'title',
      'typeDjbh',
      'djbh',
      'djbhItem',
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
  .danju_listContent {
    width: 100%;
    margin-top: 48pt;
  }
  .danju_contentItem {
    width: 100%;
    margin-top: 0pt;
  }
  .danju_item{
    width: 96%;
    height: 34pt;
    float: left;
    text-align: left;
    padding-top: 4pt;
    padding-left: 10pt;
    margin-top: 2pt;
    background-color: white;
    .item_text {
      width: 70%;
      float: left;
      .span1 {
        width: 100%;
        padding-top: 8pt;
        font-size: 11pt;
        line-height: 14pt;
      }
      p {
        width: 100%;
        font-size: 11pt;
        line-height: 10pt;
        color: #8a8a8a
      }
    }
    .item_img {
      width: 13%;
      float: right;
      img {
        padding-top: 9pt;
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
  .mint-indicator-wrapper {
    background-color: rgb(243, 243, 243)
  }
  .mint-indicator-text {
    color: #2c3e50
  }
</style>
