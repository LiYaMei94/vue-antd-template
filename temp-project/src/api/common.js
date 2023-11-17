import { get, post, put, deleteFn, upload, download } from '@/lib/axios';

const service = process.env.VUE_APP_BASE_API_8080;

// 企业枚举
export const companyEnum = (data) => {
  return get(service + '/common/company/select-down/list', data);
};
