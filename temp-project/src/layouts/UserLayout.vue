<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="user-layout-content">
        <div class="top">
          <div class="header">
            <img src="~@/assets/images/user-login-logo.png" class="logo" alt="logo" />
            <div class="title">欢迎来到EPCM工程管理平台</div>
          </div>
          <!-- <div class="desc">工程管理平台</div> -->
        </div>

        <router-view />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  .container {
    width: 100%;
    min-height: 100%;
    background: url(~@/assets/images/user-layout-bg-1.png) no-repeat 50%;
    background-size: cover;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 0%;
      width: 100%; // 40%表达需要渐变的宽度
      height: 100%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.25); // #fff表示需要兼容的底色
    }

    .user-layout-content {
      width: 400px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      .top {
        text-align: center;
        margin-bottom: 69px;

        .header {
          .logo {
            height: 132px;
            width: 132px;
            vertical-align: top;
            border-style: none;
            margin-bottom: 24px;
          }

          .title {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 500;
            color: #fff;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
    }

    a {
      text-decoration: none;
    }
  }
}
</style>
