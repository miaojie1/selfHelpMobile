<template>
  <div>
    <mt-header title="我的单据" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" v-show="origin === 'toDoCard' || origin === 'listBody'" @click="showFlowDetails">审批历史</mt-button>
    </mt-header>
    <div style="width: 100%; height: 100pt;" v-show="show">
      <div style="width: 10%; margin:0 auto; margin-top: 200pt">
        <mt-spinner :size="30" type="fading-circle" style="margin:0 auto;"></mt-spinner>
      </div>
    </div>
    <div v-if="headContent.length === 0 && show === false">
      <no-data title="单据信息"></no-data>
    </div>
    <div v-else-if="content.length > 0 && show === false">
      <!-- 表头 -->
      <div class="danju_list_name_top">
        <img src="@/assets/shenqing.png" />
        <div>{{title[0].tag}}</div>
      </div>
      <div class="danju_list_body_content" style="margin-bottom: -3pt">
        <div class="danju_card_body_item" v-for="(keyItem,m) in headContentKey" :key="m" @click="handleHeadBodyItem(keyItem)">
          <span class="danju_body_title">{{keyItem.title}}</span>
          <span class="danju_body_value">{{headContent[0][keyItem.key]}}</span>
        </div>
      </div>
      <div class="fillDiv" style="height: 5pt"></div>
      <div class="danju_list_body_content">
        <!-- 如果分录为空则不显示 -->
        <div v-for="(i, j) in content"  v-if="i.length > 0"  :key="j">
          <div class="danju_list_name">
            <img src="@/assets/danju.png" class="danjuPic" width="10pt" height="10pt"/>
            <div>{{title[j + 1].tag}}</div>
          </div>
          <div v-for="(item, index) in i" :key="index" class="danju_list_body">
            <div class="danju_list_name">
              <img src="@/assets/formpic.png" />
              <div>记录 {{index + 1}}</div>
            </div>
            <div class="danju_card_body_item" v-for="(contentKeyItem, m) in contentKey[j]" :key="m">
              <span class="danju_body_title">{{contentKeyItem.title}}</span>
              <span class="danju_body_value">{{item[contentKeyItem.key]}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fillDiv"></div>
    </div>
    <div v-else-if="content.length === 0 && show === false">
      <div class="danju_list_name_top">
        <img src="@/assets/shenqing.png" />
        <div>{{title[0].tag}}</div>
      </div>
      <div class="danju_list_body_content" style="margin-bottom: -3pt">
        <div class="danju_card_body_item" v-for="(keyItem,m) in headContentKey" :key="m">
          <span class="danju_body_title">{{keyItem.title}}</span>
          <span class="danju_body_value">{{headContent[0][keyItem.key]}}</span>
        </div>
      </div>
      <div class="fillDiv"></div>
    </div>
  </div>
</template>
<script>
import noData from '@/components/common/noData'
export default {
  data () {
    return {
      djbh: '',
      type_djbh: '',
      origin: '',
      backUrl: '',
      contentKey: [],
      content: [],
      headContentKey: [],
      headContent: [],
      show: true,
      title: []
    }
  },
  created: function () {
    this.origin = this.$store.getters.pathStatus
    if (this.origin === 'toDoCard') {
      this.backUrl = '/toDoCard'
    } else if (this.origin === 'listHead') {
      this.backUrl = '/danjuListHead'
    } else if (this.origin === 'listBody') {
      this.backUrl = '/toDoCard'
    } else if (this.origin === 'doneCard') {
      this.backUrl = '/toDoCard'
    }
    this.getDanJuDetails()
  },
  methods: {
    // 获取单据详情
    getDanJuDetails () {
      var url = '/process/invoicesDetails'
      let params = {
        djbh: this.$store.getters.djbhItem,
        type_djbh: this.$store.getters.typeDjbh
      }
      let data = {
        'requestBody': JSON.stringify(params)
      }
      this.$http.post(url, data).then((val) => {
        if (val.data.code === 200) {
          this.show = false
          this.title = val.data.data.title
          // alert(val.data.data.content.length)
          if (val.data.data.content.length > 1) {
            // 获取表头以及值
            this.headContentKey = val.data.data.contentKey[0]
            this.headContent = val.data.data.content[0]
            // 获取数据以及值
            for (var i = 0; i < (val.data.data.content.length - 1); i++) {
              this.contentKey[i] = val.data.data.contentKey[i + 1]
              this.content[i] = val.data.data.content[i + 1]
            }
          } else {
            this.headContentKey = val.data.data.contentKey[0]
            this.headContent = val.data.data.content[0]
          }
        } else {
          this.$messagebox({
            title: '错误',
            message: val.data.msg
          })
          this.show = false
        }
      })
    },
    // 点击"历史记录"获取流程详情
    showFlowDetails () {
      let params = this.$store.getters.missionFlowDetail
      this.$router.push({
        path: '/flowDetails',
        query: {
          // 传递JSON格式，传数组还未找到方法
          data: JSON.stringify(params)
        }
      })
      this.$store.dispatch('modifyPathStatus', 'listBody')
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
  background-color: rgb(243, 243, 243);
}
.danju_list_name_top {
  width: 90%;
  height: 25pt;
  margin-bottom: -5pt;
  margin-top: 47pt;
  text-align: left;
  padding-top: 9pt;
  padding-left: 10pt;
  img {
    width: 20pt;
    height: 20pt;
    float: left;
  }
  div {
    margin-left: 5pt;
    margin-bottom: 5pt;
    font-size: 11pt;
    padding-top: 2pt;
    color: #8a8a8a;
    float: left;
  }
}
.danju_list_body_content {
  width: 96%;
  display: flex;
  flex-flow: column;
  .danju_list_name {
    width: 100%;
    height: 20pt;
    margin-bottom: -5pt;
    text-align: left;
    padding-top: 9pt;
    padding-left: 7pt;
    img {
      width: 18pt;
      height: 18pt;
      float: left;
    }
    div {
      margin-left: 5pt;
      margin-bottom: 5pt;
      font-size: 11pt;
      padding-top: 2pt;
      color: #8a8a8a;
      float: left;
    }
    .danjuPic {
      width: 14pt;
      height: 14pt;
      float: left;
      padding-top: 3pt;
      padding-left: 2pt;
    }
  }
  .danju_list_body_xvhao {
    width: 100%;
    height: 30pt;
    background-color: white;
    margin-bottom: 5pt;
    img {
      width: 20pt;
      height: 20pt;
      float: left;
      margin-left: 10pt;
      padding-top: 4pt;
    }
    .danju_detail_body_text {
      width: 50%;
      height: 20pt;
      float: left;
      text-align: left;
      margin-left: 10pt;
      padding-top: 6pt;
    }
    .more {
      width: 20pt;
      height: 20pt;
      float: right;
      margin-right: 10pt;
      padding-top: 4pt;
    }
  }
  .danju_card_body_item {
    width: 100%;
    float: left;
    height: 18pt;
    margin-top: 1pt;
    background-color: white;
    text-align: left;
    padding-top: 5pt;
    padding-left: 10pt;
    .danju_body_title {
      width: 40%;
      height: 18pt;
      font-size: 10pt;
      color: #8a8a8a;
      float: left;
    }
    .danju_body_value {
      width: 52%;
      height: 18pt;
      font-size: 10pt;
      float: left;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
  }
  .danju_list_body {
    width: 100%;
    // padding-top: 5pt;
    // margin-top: 5pt
  }
}
.fillDiv {
  width: 100%;
  height: 30pt;
  float: left;
}
</style>
