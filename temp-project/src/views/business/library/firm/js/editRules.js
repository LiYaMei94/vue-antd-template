import { isNull } from '@/utils/utils';
// 表单校验规则
export const formRulesValidator = {
  companyName: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"\@\w\u4e00-\u9fff]{1,32}$/;
    if (isNull(value)) {
      return Promise.reject('请输入企业名称');
    } else if (!reg.test(value)) {
      return Promise.reject('请输入1~32位汉字、英文、数字、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  uniformCreditCode: async (_rule, value) => {
    const reg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
    if (isNull(value)) {
      return Promise.reject('请输入统一信用代码');
    } else if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入18位正确的统一信用代码');
    } else {
      return Promise.resolve();
    }
  },
  contactPhone: async (_rule, value) => {
    const reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入11位正确号码');
    } else {
      return Promise.resolve();
    }
  },
  contactPerson: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"\@\w\u4e00-\u9fff]{0,20}$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入长度最大是20位的汉字、英文、数字、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  legalPersion: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"\@\w\u4e00-\u9fff]{0,20}$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入长度最大是20位的汉字、英文、数字、常用符号');
    } else {
      return Promise.resolve();
    }
  },
  registeredAddress: async (_rule, value) => {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"\@\w\u4e00-\u9fff]{0,100}$/;
    if (!reg.test(value) && !isNull(value)) {
      return Promise.reject('请输入1~100汉字、英文、数字、常用符号');
    } else {
      return Promise.resolve();
    }
  }
};

export const rules = {
  companyName: [
    {
      required: true,
      validator: formRulesValidator?.companyName
    }
  ],
  nature: [
    {
      required: true
    }
  ],
  uniformCreditCode: [
    {
      required: true,
      validator: formRulesValidator?.uniformCreditCode
    }
  ],
  contactPhone: [
    {
      validator: formRulesValidator?.contactPhone
    }
  ],
  contactPerson: [
    {
      validator: formRulesValidator?.contactPerson
    }
  ],
  legalPersion: [
    {
      validator: formRulesValidator?.legalPersion
    }
  ],
  registeredAddress: [
    {
      validator: formRulesValidator?.registeredAddress
    }
  ],
  businessLicense: [
    {
      required: true,
      message: '请上传营业执照'
    }
  ]
};
