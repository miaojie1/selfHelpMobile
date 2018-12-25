<template>
  <div>
    <mt-header title="我的申请记录" fixed>
      <router-link :to="backUrl" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="ar_content">
      <div v-if="applyData === '' || applyData === null">
        <no-data title="申请记录"></no-data>
      </div>
      <div v-else class="ar_item" v-for="(n,index) in applyData.length" :key="n" @click="handleItem(applyData[index].positionId)">
        <div style="width: 60%;float:left">
          <p class="ar_itemP1">{{applyData[index].positionName}}</p>
          <span style="color: #8a8a8a">{{applyData[index].place}}&nbsp;|&nbsp;{{applyData[index].numbers}}&nbsp;|&nbsp;{{applyData[index].applyDate}}</span>
          <p class="ar_itemP2">{{applyData[index].orgName}}</p>
        </div>
        <div class="ar_content_img">
          <img src="@/assets/right.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import noData from '@/components/common/noData'
export default {
  data () {
    return {
      applyData: [],
      backUrl: ''
    }
  },
  created: function () {
    console.log('我的申请记录' + this.missionEmpNum)
    this.getMyApply()
    this.backUrl = '/recruit?userName=' + this.missionEmpNum
  },
  methods: {
    getMyApply () {
      var getMyApply = '/recruit/getmyapply'
      var param = {
        userId: this.$store.getters.missionEmpNum
      }
      var data = {
        'requestBody': JSON.stringify(param)
      }
      this.$http.post(getMyApply, data).then((value) => {
        console.log(value.data.data)
        this.applyData = value.data.data
        console.log('我的申请：' + this.applyData.length)
      })
    },
    handleItem (id) {
      this.$router.push({
        path: '/detail',
        query: {
          recruitId: id,
          isMyPost: '1', // 代表我的申请
          userName: this.missionEmpNum
        }
      })
    }
  },
  computed: {
    ...mapGetters([
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
  background-color: rgb(238, 240, 240);
}
.ar_content {
  width: 100%;
  background-color: rgb(238, 240, 240);
  margin-top: 46pt;
  padding-top: 7pt;
}
.ar_item {
  width: 96%;
  height: 55pt;
  padding-top: 7pt;
  margin-bottom: 6pt;
  background-color: white;
  text-align: left;
  padding-left: 10pt;
  font-size: 10pt;
  .ar_content_img {
    width: 13%;
    float: right;
    padding-top: 16pt;
    img {
      width: 15pt;
      height: 15pt;
    }
  }
}
.ar_itemP1 {
  font-size: 12pt;
  font-weight: 500;
  line-height: 20pt;
  margin: 0px;
}
.ar_itemP2{
  font-size: 10pt;
  font-weight: 400;
  line-height: 20pt;
  margin: 0px;
}
.noDataDiv {
  width: 100%;
  height: 50%;
  margin: 0 auto;
  img {
    width: 30%;
    height: 30%;
    margin-top: 20pt;
  }
  p {
    margin-top: -10pt;
    font-size: 11pt;
  }
}
</style>
