<template>
  <div class="noDataDiv">
    <img src="@/assets/none.png">
    <p>暂时没有{{title}}哦~</p>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="less">
.noDataDiv {
  width: 100%;
  height: 50%;
  margin: 0 auto;
  margin-top: 50pt !important;
  img {
    width: 60% !important;
    margin-top: 45pt;
  }
  p {
    margin-top: -10pt;
    font-size: 11pt;
  }
}
</style>
