export default {
  component: async () => await import('./index.vue'),
  defaultSchema: {
    label: '扩展组件',
    type: 'test1',
    componentProps: {}
  },
  config: {
    attribute: [
      {
        label: '属性1',
        type: 'input',
        field: 'name'
      }
    ]
  }
};
