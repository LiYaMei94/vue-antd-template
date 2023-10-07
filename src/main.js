import { createApp } from 'vue';
import App from './App';
import router from './router';
import directives from '@/directives';
import addComponent from '@/plugins/addComponent';
import store from './store';
import { pluginManager, setupAntd } from 'epic-designer';
import { setupDesignerExtensions } from './lib/epic-designer/designer-extensions';
import 'ant-design-vue/dist/antd.variable.min.css';
// 引入k-designer样式
import 'epic-designer/dist/style.css';
// FIXME:确保common.less在所有样式的最后使用
import './assets/style/common.less';

// 使用Antd UI
setupAntd(pluginManager);
setupDesignerExtensions(pluginManager);

const app = createApp(App);

// 阻止Promise抛出reject但是没有写catch
window.onunhandledrejection = (event) => {
  console.log(event.reason);
  event.preventDefault();
};

// 处理epic-designer 库中引入的element-plus出现的ResizeObserver loop completed with undelivered notifications错误
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};
// 处理epic-designer 库中引入的element-plus出现的ResizeObserver loop completed with undelivered notifications错误

app.use(router).use(store).use(addComponent).use(directives).mount('#app');
