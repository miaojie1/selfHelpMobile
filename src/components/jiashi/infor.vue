<template>
  <div>
    <div class="inforContent" ref="aboutMeContainer">
      <div class="logoContent">
        <img v-if="content.img != ''" src="content.img"/>
        <img v-else src="@/assets/a7.png" />
      </div>
      <div class="descriptionContent">
        {{content.content}}
      </div>
      <div class="conpanyContent">
        <mt-cell title="网址：" align="left">{{content.url}}</mt-cell>
        <mt-cell title="电话：" align="left">{{content.iphone}}</mt-cell>
        <mt-cell title="公司：" align="left">{{content.company}}</mt-cell>
      </div>
      <div class="footContent">
        <span>{{content.company}}</span>
        <div>{{content.dnCode}}{{content.company}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      content: '',
      clientHeight: ''
    }
  },
  created () {
    this.getInfor()
  },
  methods: {
    getInfor () {
      let url = '/company/aboutme'
      this.$http.get(url).then((val) => {
        this.content = val.data.data
      }).catch((val) => {
        console.log(val)
      })
    },
    changeFixed (clientHeight) {
      this.$refs.aboutMeContainer.style.height = clientHeight + 'px'
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
  }
}
</script>
<style lang="less">
body {
  margin: 0pt;
}
.inforContent {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-top: 30pt;
  margin-top: 0pt;
  margin-bottom: 0pt;
  background-color: rgb(243, 243, 243);
}
.logoContent {
  margin: 0 auto;
  img {
    margin-top: 12pt;
    margin-bottom: 2pt;
    width: 60pt;
    height: 60pt;
  }
}
.descriptionContent {
  font-size: 11pt;
  text-align: left;
  padding-left: 10pt;
  padding-right: 10pt;
  text-indent:2em;
  line-height: 18pt;
}
.conpanyContent {
  margin-top: 5pt;
  .mint-cell {
    min-height: 43px;
  }
}
.footContent {
  margin-top: 19%;
  margin-bottom: 19%;
  text-align: center;
  span {
    font-weight: 600;
  }
  div {
    margin-top: 4pt;
    font-size: 11pt;
  }
}
</style>
