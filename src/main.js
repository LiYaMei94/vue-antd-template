import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import directives from '@/directives';
import addComponent from '@/plugins/addComponent';
import 'ant-design-vue/dist/antd.variable.min.css';
import store from './store';
import './assets/style/common.less';

const app = createApp(App);

// 阻止Promise抛出reject但是没有写catch
window.onunhandledrejection = (event) => {
  // 不兼容ie
  console.warn(event.reason);
  event.preventDefault();
};

app.use(router).use(store).use(addComponent).use(directives).mount('#app');
