import { isNull } from '@/utils/utils';
// 表单校验规则
const formRulesValidator = {
  dictName: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{1,50}$/;
    if (isNull(value)) {
      return Promise.reject('请输入字典名称');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入汉字、英文、数值、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  dictType: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{1,50}$/;
    if (isNull(value)) {
      return Promise.reject('请输入字典标识');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入英文、数值、常用符号');
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
  dictName: [
    {
      required: true,
      validator: formRulesValidator?.dictName
    }
  ],
  dictType: [
    {
      required: true,
      validator: formRulesValidator?.dictType
    }
  ],
  status: [{ required: true }],
  remark: [
    {
      validator: formRulesValidator?.remark
    }
  ]
};