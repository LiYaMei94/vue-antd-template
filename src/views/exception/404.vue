<template>
  <div class="exception-container">
    <img class="logo" src="~@/assets/images/404@3x.png" />
    <div class="title">抱歉，您的页面迷路了</div>
    <div class="sub-title">
      我们正在全力搜查中，请点击
      <router-link :to="{ path: '/' }">返回首页</router-link>
    </div>
    <a-button type="primary" @click="handleRefresh">刷新试试</a-button>
  </div>
</template>

<script setup>
const handleRefresh = () => {
  location.reload();
};
</script>

<style lang="less" scoped>
.exception-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  box-sizing: border-box;
  .logo {
    width: 230px;
    height: auto;
    margin-bottom: 20px;
  }
  .title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .sub-title {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 10px;
  }
}
</style>
