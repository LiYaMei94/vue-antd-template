import { isNull } from '@/utils/utils';
// 表单校验规则
const formRulesValidator = {
  dictLabel: async (_rule, value) => {
    const reg = /^[\w\u4e00-\u9fff]{1,20}$/;
    if (isNull(value)) {
      return Promise.reject('请输入数据标签');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入汉字、英文、数值');
    } else {
      return Promise.resolve();
    }
  },
  dictValue: async (_rule, value) => {
    const reg = /^[\w]{1,20}$/;
    if (isNull(value)) {
      return Promise.reject('请输入数据键值');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入英文、数值');
    } else {
      return Promise.resolve();
    }
  },
  remark: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff\s]{0,200}$/;
    if (!reg.test(value)) {
      return Promise.reject('请输入汉字、英文、数值、常用符号');
    } else {
      return Promise.resolve();
    }
  }
};
export const rules = {
  dictLabel: [
    {
      required: true,
      validator: formRulesValidator?.dictLabel
    }
  ],
  dictValue: [
    {
      required: true,
      validator: formRulesValidator?.dictValue
    }
  ],
  status: [{ required: true }],
  remark: [
    {
      validator: formRulesValidator?.remark
    }
  ]
};
