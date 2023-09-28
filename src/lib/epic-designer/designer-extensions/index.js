import Test from './components/Test';
import Test1 from './components/TEST1';

// 安装扩展
export function setupDesignerExtensions(pluginManager) {
  // 注册组件
  pluginManager.registerComponent(Test);
  pluginManager.registerComponent(Test1);

  // 设置分组
  pluginManager.setSchemaGroup([
    {
      title: '基本组件',
      list: [
        'form',
        'input',
        'textarea',
        'number',
        'password',
        'select',
        'cascader',
        'checkbox',
        'radio',
        'date',
        'time',
        'slider',
        'switch',
        'color-picker',
        'upload-file',
        'upload-image',
        'button'
      ]
    },
    {
      title: '布局组件',
      list: ['card', 'row']
    },
    {
      title: '业务组件',
      list: ['test', 'test1']
    }
  ]);
}
