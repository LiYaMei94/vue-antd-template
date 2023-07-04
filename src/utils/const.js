export const ACCESS_TOKEN = 'ACCESS-TOKEN';

export const CREATE = 'create';
export const EDIT = 'edit';
export const DETAIL = 'detail';

export const PAGE_TITLE_MAP = {
  [CREATE]: '添加',
  [EDIT]: '编辑',
  [DETAIL]: '查看'
};

export const PAGE_ROUTE_NAME_MAP = {
  [CREATE]: 'Create',
  [EDIT]: 'Edit',
  [DETAIL]: 'Detail'
};

export const CHANNEL_ACCOUNT_CONFIG_DEMO = {
  阿里云: {
    url: 'dysmsapi.aliyuncs.com',
    region: 'cn-hangzhou',
    secretId: 'LTAI5tNRCD1JWqUvJf5KqdbA',
    secretKey: 'rl76n9s4s4vmEWsEUqI2j98VKiT7p3',
    templateId: 'SMS_154950909',
    signName: '阿里云短信测试',
    supplierId: 20,
    supplierName: '阿里云',
    SmsOperatorName: 'AliSmsOperator'
  },
  腾讯云: {
    url: 'sms.tencentcloudapi.com',
    region: 'ap-guangzhou',
    secretId: 'AKIDhDxxxxxxxx1WljQq',
    secretKey: 'B4hwww39yxxxrrrrgxyi',
    smsSdkAppId: '1400834432',
    templateId: '1182097',
    signName: '腾讯云短信测试',
    supplierId: 10,
    supplierName: '腾讯云',
    SmsOperatorName: 'TencentSmsOperator'
  }
};

export const TEMPLATE_STATUS_TYPE_ENUM = [
  {
    label: '定时',
    value: 10
  },
  {
    label: '实时',
    value: 20
  }
];

// export const SEND_CHANNEL_SMS = 30;
// export const SEND_CHANNEL_EMAIL = 40;
// export const SEND_CHANNEL_MINI = 60;
// export const MESSAGE_MOULD_PAGECOM = {
//   [SEND_CHANNEL_SMS]: 'Sms',
//   [SEND_CHANNEL_EMAIL]: 'Email',
//   [SEND_CHANNEL_MINI]: 'MiniProgram'
// };
