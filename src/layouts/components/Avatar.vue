<template>
  <a-dropdown :trigger="['click']">
    <div class="user-container">
      <div class="user-avatar">
        <a-avatar :size="40" style="background-color: var(--ant-primary-color)">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </div>
      <div class="user-info">
        <div>{{ state?.user?.userInfo?.userName }}</div>
        <div>{{ state?.user?.userInfo?.nickName }}</div>
      </div>
    </div>
    <template #overlay>
      <a-menu>
        <!-- <a-menu-item key="0">
          <a href="javaScript:;" @click="changePassword">修改密码</a>
        </a-menu-item>
        <a-menu-divider /> -->
        <a-menu-item key="2">
          <a href="javaScript:;" @click="handleLogout">退出登录</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup>
import db from '@/utils/db';
import { ACCESS_TOKEN } from '@/utils/const';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { logout } from '@/api/user';

const { state } = useStore();
const router = useRouter();
const DB = new db();
const changePassword = () => {};
const handleLogout = async () => {
  try {
    await logout();
    DB.deleteLocal(ACCESS_TOKEN);
    DB.deleteSession(ACCESS_TOKEN);
    router.push('/user/login');
  } catch (error) {
    console.error('user-login-handleLogout', error);
  }
};
</script>
<style lang="less" scoped>
.user-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .user-info {
    margin-left: 10px;
    div {
      height: 18px;
      line-height: 18px;
      font-size: 13px;
    }
  }
}
</style>
