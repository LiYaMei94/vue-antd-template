<template>
  <a-dropdown :trigger="['click']" :overlayClassName="'avatar-dropdown'">
    <div class="user-container">
      <div class="user-avatar">
        <a-avatar :size="32" style="background-color: var(--private-primary-color)">
          <template #icon>
            <IconSvg name="user-profile" class="user-profile" fill="#fff"></IconSvg>
          </template>
        </a-avatar>
      </div>
    </div>
    <template #overlay>
      <a-menu mode="vertical" v-model:selectedKeys="selectedKeys">
        <div class="user-info">
          <div>{{ state?.user?.userInfo?.userName }}</div>
          <div>{{ state?.user?.userInfo?.realName }}</div>
        </div>
        <a-menu-divider />
        <!-- <a-sub-menu key="sub1" title="切换主题" class="avatar-menu-item">
          <template #icon>
            <IconSvg name="theme-switch" class="theme-switch-icon"></IconSvg>
          </template>
          <a-menu-item key="light">
            <a href="javaScript:;" @click="changeTheme($event, 'light')">白月光</a>
          </a-menu-item>
          <a-menu-item key="dark">
            <a href="javaScript:;" @click="changeTheme($event, 'dark')">曜石黑</a>
          </a-menu-item>
        </a-sub-menu> -->
        <a-menu-item key="2" class="avatar-menu-item">
          <template #icon><IconSvg name="logout" class="logout-icon"></IconSvg></template>
          <a href="javaScript:;" @click="handleLogout">退出登录</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup>
import { ref } from 'vue';
import DB from '@/utils/db';
import { ACCESS_TOKEN } from '@/utils/const';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { logout } from '@/api/user';
import { useTheme } from '@/hooks/useTheme';

const { changePrimaryColor, setThemeColor, theme } = useTheme();
const { dispatch, state } = useStore();
const router = useRouter();
const selectedKeys = ref([state?.global?.theme]);

const changePassword = () => {};

// 切换主题
const changeTheme = (event, key) => {
  setThemeColor(key);
  selectedKeys.value = [key];
};

// 退出登录
const handleLogout = async () => {
  try {
    await logout();
    DB.clearLocal();
    DB.clearSession();
    // DB.deleteLocal(ACCESS_TOKEN);
    // DB.deleteSession(ACCESS_TOKEN);
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
  .ant-avatar {
    position: relative;
  }
}
.user-info {
  padding: 5px 12px;
  div:nth-of-type(1) {
    color: var(--private-first-text-color);
    font-size: 14px;
    font-weight: 500;
  }
  div:nth-of-type(2) {
    color: var(--private-second-text-color);
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
<style lang="less">
.avatar-menu-item {
  padding: 4px 0;
}
.avatar-dropdown {
  top: 65px !important;
}
.ant-dropdown-menu-submenu-title {
  display: flex;
  align-items: center;
}

.user-profile {
  width: 16px;
  height: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -10px;
}

.theme-switch-icon,
.logout-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
#theme-switch {
  fill: var(--private-content-bg);
  path {
    stroke: var(--private-second-text-color);
  }
}
.logout-icon {
  fill: var(--private-second-text-color);
}
</style>
