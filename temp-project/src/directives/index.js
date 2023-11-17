import { someHidden, everyHidden, someDisabled, everyDisabled } from './permission';

export default {
  install: (app, options) => {
    // 按钮权限自定义指令
    app.directive('hiddenS', someHidden);
    app.directive('hiddenE', everyHidden);
    app.directive('disabledS', someDisabled);
    app.directive('disabledE', everyDisabled);
  }
};
