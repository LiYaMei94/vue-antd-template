import { get, post, put, deleteFn } from '@/lib/axios';

// 修改
export const procedureTelUpdate = (data) => {
  return put('/system/role', data);
};

// 新增
export const procedureTelCreate = (data) => {
  return post('/system/role', data);
};

// 角色详情
export const procedureTelDetail = (data) => {
  return get('/system/role/query', data);
};

// 列表
export const procedureTelList = async (data) => {
  return get('/system/role/list', data);
};

// 删除
export const procedureTelDelete = (data) => {
  return deleteFn('/system/role/remove', data);
};
