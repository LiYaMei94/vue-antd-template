import { somePermission, everyPermission } from './permission';

export default {
  install: (app, options) => {
    // 按钮权限自定义指令
    app.directive('some', somePermission);
    app.directive('every', everyPermission);
  }
};
