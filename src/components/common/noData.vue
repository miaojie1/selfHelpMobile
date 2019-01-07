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
  height: 200pt;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  // margin-top: 50pt !important;
  img {
    width: 60% !important;
  }
  p {
    font-size: 11pt;
  }
}
</style>
