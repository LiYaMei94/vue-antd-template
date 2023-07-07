<template>
  <div class="user-login">
    <a-form class="user-layout-login" :model="formState" @finish="onFinish">
      <a-form-item name="username" :rules="[{ required: true, message: '用户名' }]">
        <a-input placeholder="用户名" size="large" v-model:value="formState.username" />
      </a-form-item>
      <a-form-item name="password" :rules="[{ required: true, message: '密码' }]">
        <a-input-password placeholder="密码" size="large" v-model:value="formState.password" />
      </a-form-item>
      <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
        <div class="code-wrap">
          <a-input placeholder="验证码" size="large" v-model:value="formState.code" />
          <img class="code-img" :src="codeBase64" @click="getCode" v-if="codeBase64" />
          <a-button type="primary" class="button-39" @click="getCode" v-else>验证码</a-button>
        </div>
      </a-form-item>
      <a-form-item name="remember">
        <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-button">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import db from '@/utils/db';
import { Base64 } from 'js-base64';
import { code, login, logout } from '@/apis/user';
import { resultCallBack } from '@/utils/utils';
import { useRouter } from 'vue-router';
import { ACCESS_TOKEN } from '@/utils/const';
import { allEnum } from '@/apis/index';
import { useStore } from 'vuex';
import { usePermission } from '@/hooks/usePermission';

const { getMenuList } = usePermission();
const { dispatch } = useStore();
const router = useRouter();
const DB = new db();
const formState = ref({ username: null, password: null, remember: false, uuid: null, code: null });
const codeBase64 = ref(null);

onMounted(() => {
  // 账户密码回显
  const password = DB.getLocal('password');
  const username = DB.getLocal('username');
  formState.value = {
    username: username || null,
    password: (password && Base64.decode(password)) || null,
    remember: false
  };
});

// 获取验证码
const getCode = async () => {
  try {
    const result = await code();
    codeBase64.value = `data:image/jpeg;base64,${result?.data?.img}`;
    formState.value.uuid = result?.data?.uuid;
  } catch (error) {}
};

// 提交
const onFinish = async (values) => {
  try {
    const result = await login({ ...formState.value });
    resultCallBack({ result, successMessage: '登录成功' }).then(async (res) => {
      // 设置token
      DB.setLocal(ACCESS_TOKEN, res);

      // 动态加载菜单和路由
      await getMenuList();

      // 全局枚举
      const allEnumData = (await allEnum()).data;
      dispatch('setAllEnum', allEnumData);

      // FIXME:跳转首页,如果是登录失效重新登录之后跳转到之前的页面
      router.push({ name: `ChannelList` });

      // 记住密码
      if (values.remember) {
        DB.setLocal('username', values.username);
        DB.setLocal('password', Base64.encode(values.password));
      }
    });
  } catch (error) {}
};
</script>

<style lang="less" scoped>
.user-login {
  min-width: 260px;
  width: 368px;
  margin: 0 auto;
  .code-wrap {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .code-img {
      width: 90px;
      height: 40px;
    }
    .button-39 {
      width: 90px;
    }
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    width: 100%;
    height: @height40;
  }
}
</style>
