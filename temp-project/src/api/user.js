import { post, get } from '@/lib/axios';

const service = process.env.VUE_APP_BASE_API_8080;

export const login = (data) => {
  return post(service + '/login', data, { skipHandleResponse: true });
};

export const logout = (data) => {
  return post(service + '/logout', data, { skipHandleResponse: true });
};

export const getRoutesInfo = async (data) => {
  return get(service + '/getRouters', data);
};

// 用户信息
export const getUserInfo = (data) => {
  return get(service + '/getInfo', data);
};
