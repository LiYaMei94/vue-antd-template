<template>
  <div class="user-login">
    <a-form :model="formState" @finish="onFinish" :rules="rules" autocomplete="off">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="密码登录">
          <a-form-item name="username">
            <a-input placeholder="用户名" size="large" v-model:value="formState.username" />
          </a-form-item>
          <a-row>
            <a-col :span="15">
              <a-form-item name="password">
                <a-input-password class="password-input" placeholder="密码" size="large" v-model:value="formState.password" />
              </a-form-item>
            </a-col>
            <a-col :span="9" style="padding-left: 16px; box-sizing: border-box">
              <a-form-item>
                <a-button type="primary" html-type="submit" class="login-button">登录</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
        <!-- <a-tab-pane key="2" tab="验证码登录" force-render>验证码登录</a-tab-pane> -->
      </a-tabs>
      <!-- <a-row>
        <a-col :span="12">
          <a-form-item>
            <router-link class="forgot-password" :to="{ name: 'UserEditPassword' }">忘记密码</router-link>
          </a-form-item>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-form-item name="remember">
            <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
          </a-form-item>
        </a-col>
      </a-row> -->
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import DB from '@/utils/db';
import { Base64 } from 'js-base64';
import { login, logout } from '@/api/user';
import { useRouter } from 'vue-router';
import { ACCESS_TOKEN } from '@/utils/const';
import { useStore } from 'vuex';
import { usePermission } from '@/hooks/usePermission';
import { isNull, checkLength, resultCallBack } from '@/utils/utils';

const { refresh } = usePermission();
const { dispatch, state } = useStore();
const router = useRouter();
const formState = ref({});
const codeBase64 = ref(null);
const activeKey = ref('1');

onMounted(() => {
  // 账户密码回显
  const password = DB.getSession('password') || DB.getLocal('password');
  const username = DB.getSession('username') || DB.getLocal('username');
  formState.value = {
    username: username || null,
    password: (password && Base64.decode(password)) || null
  };
});

const validator = {
  username: async (_rule, value) => {
    if (isNull(value)) {
      return Promise.reject('请输入用户名');
    } else if (!checkLength(value, 4, 20)) {
      return Promise.reject('用户名长度为4~20');
    } else {
      return Promise.resolve();
    }
  },
  password: async (_rule, value) => {
    if (isNull(value)) {
      return Promise.reject('请输入密码');
    } else if (!checkLength(value, 8, 20)) {
      return Promise.reject('密码长度为8~20');
    } else {
      return Promise.resolve();
    }
  }
};
const rules = {
  username: [
    {
      required: true,
      validator: validator?.username
    }
  ],
  password: [
    {
      required: true,
      validator: validator?.password
    }
  ]
};

// 提交
const onFinish = async (values) => {
  try {
    const result = await login({ ...formState.value });
    resultCallBack(result, '登录成功').then(async (res) => {
      const token = res?.token || res;
      // 设置token/使用session隔离token
      DB.setSession(ACCESS_TOKEN, token);
      DB.setLocal(ACCESS_TOKEN, token);

      // 用户信息&菜单&路由
      await refresh();

      // FIXME:跳转首页,如果是登录失效重新登录之后跳转到之前的页面
      res?.redirectPath ? router.push(res?.redirectPath) : router.push({ path: `/` });

      // 记住密码
      DB.setLocal('username', values.username);
      DB.setLocal('password', Base64.encode(values.password));
    });
  } catch (error) {
    console.error('user-login-onFinish', error);
  }
};
</script>

<style lang="less" scoped>
.user-login {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .forgot-password {
    color: #fff;
    text-decoration-line: underline;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    width: 100%;
    height: 40px;
    background: var(--private-primary-color-65);
  }
}
</style>
<style lang="less">
.user-login {
  input {
    caret-color: #fff;
  }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }

  .ant-form {
    width: 100%;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn,
  .ant-checkbox-wrapper,
  .ant-input-password-icon {
    color: #fff;
  }
  .ant-tabs-bottom > .ant-tabs-nav:before,
  .ant-tabs-bottom > div > .ant-tabs-nav:before,
  .ant-tabs-top > .ant-tabs-nav:before,
  .ant-tabs-top > div > .ant-tabs-nav:before {
    border-bottom: 0px solid #f0f0f0;
  }
  .ant-tabs-ink-bar {
    background: rgba(0, 0, 0, 0.25);
    display: none;
  }
  .ant-tabs-bottom > .ant-tabs-nav,
  .ant-tabs-bottom > div > .ant-tabs-nav,
  .ant-tabs-top > .ant-tabs-nav,
  .ant-tabs-top > div > .ant-tabs-nav {
    margin-bottom: 0px;
  }
  .ant-tabs-tab {
    padding: 10px 0;
  }
  .ant-input,
  .ant-form .ant-input-affix-wrapper {
    background-color: rgba(0, 0, 0, 0.25);
    color: #fff;
    border-color: #fff;
  }
  .password-input {
    .ant-input-lg {
      background-color: transparent;
    }
  }

  .ant-checkbox + span {
    padding-right: 0;
  }
  .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper,
  .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:hover,
  .ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
  .ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover,
  .ant-form-item-has-error
    :not(.ant-input-number-affix-wrapper-disabled):not(.ant-input-number-affix-wrapper-borderless).ant-input-number-affix-wrapper,
  .ant-form-item-has-error
    :not(.ant-input-number-affix-wrapper-disabled):not(.ant-input-number-affix-wrapper-borderless).ant-input-number-affix-wrapper:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
}
</style>
