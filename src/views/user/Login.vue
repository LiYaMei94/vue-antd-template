<template>
  <div class="user-login">
    <a-form class="user-layout-login" :model="formState" @finish="onFinish">
      <a-form-item name="username" :rules="[{ required: true, message: '用户名' }]">
        <a-input placeholder="用户名" size="large" v-model:value="formState.username" />
      </a-form-item>
      <a-form-item name="password" :rules="[{ required: true, message: '密码' }]">
        <a-input-password placeholder="密码" size="large" v-model:value="formState.password" />
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

const DB = new db();
const formState = ref({ username: null, password: null, remember: false });

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

// 提交
const onFinish = (values) => {
  console.log('formRef', values);

  // 记住密码
  if (values.remember) {
    DB.setLocal('username', values.username);
    DB.setLocal('password', Base64.encode(values.password));
  }
};
</script>

<style lang="less" scoped>
.user-login {
  min-width: 260px;
  width: 368px;
  margin: 0 auto;
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    width: 100%;
    height: @height40;
  }
}
</style>
