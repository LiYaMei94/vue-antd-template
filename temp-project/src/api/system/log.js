import { get, post, put, deleteFn } from '@/lib/axios';

const service = process.env.VUE_APP_BASE_API_8080;

// 登录日志列表
export const systemLoginLog = (data) => {
  return get(service + '/monitor/loginInfo/list', data);
};
