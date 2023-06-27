import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import directives from '@/directives';
import addComponent from '@/plugins/addComponent';
import 'ant-design-vue/dist/antd.variable.min.css';
import store from './store';

const app = createApp(App);
app.use(router).use(store).use(addComponent).use(directives).mount('#app');
