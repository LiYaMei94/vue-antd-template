export default {
  component: async () => await import('./index.vue'),
  defaultSchema: {
    label: '请假单',
    type: 'test',
    componentProps: {},
    children: [
      {
        label: '表单',
        type: 'form',
        name: 'default',
        componentProps: {
          labelWidth: 100,
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
          hideRequiredMark: false,
          labelPlacement: 'left',
          labelAlign: 'right',
          requireMarkPlacement: 'right',
          size: 'medium'
        },
        children: [
          {
            label: '姓名',
            type: 'input',
            field: 'name',
            input: true,
            componentProps: {
              defaultValue: '',
              placeholder: '请输入',
              type: 'text',
              size: 'medium'
            },
            rules: [
              {
                required: true,
                message: '必填项',
                type: 'string',
                trigger: ['change']
              }
            ]
          },
          {
            label: '年龄',
            type: 'number',
            field: 'age',
            input: true,
            componentProps: { style: { width: '100%' }, placeholder: '请输入' }
          }
        ]
      }
    ]
  },
  config: {}
};
