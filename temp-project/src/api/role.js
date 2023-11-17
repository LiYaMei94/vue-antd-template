import { post, get, put, deleteFn } from '@/lib/axios';
import { updateEmptyStringValue } from '@/utils/utils';
const service = process.env.VUE_APP_BASE_API_8080;

// 新增角色
export const roleCreate = (data) => {
  return post(service + '/system/role', data);
};
// 列表
export const roleList = async (data) => {
  return get(service + '/system/role/list', data);
};

// 角色详情;
export const roleDetail = async (data) => {
  const detail = await get(service + '/system/role/query', data);
  updateEmptyStringValue(detail?.data);
  return detail;
};

// 修改角色
export const roleUpdate = (data) => {
  return put(service + '/system/role', data);
};
// 删除角色
export const roleDelete = (data) => {
  return deleteFn(service + '/system/role/remove', data, { skipHandleResponse: true });
};
// 角色权限配置
export const roleConfigAuthrity = (data) => {
  return post(service + '/system/role/addMenu', data);
};
