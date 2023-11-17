import { get, post, put, deleteFn } from '@/lib/axios';
import { updateEmptyStringValue } from '@/utils/utils';

const service = process.env.VUE_APP_BASE_API_8080;

// 修改
export const personnelUpdate = (data) => {
  return put(service + '/company/user', data);
};

// 新增
export const personnelCreate = (data) => {
  return post(service + '/company/user', data);
};

// 详情
export const personnelDetail = async (data) => {
  const detail = await get(service + '/company/user/user-detail', data);
  updateEmptyStringValue(detail?.data);
  return detail;
};

// 列表
export const personnelList = async (data) => {
  return await get(service + '/company/user/list', data);
};

// 删除
export const personnelDelete = (data) => {
  return deleteFn(service + '/company/user/remove', data, { skipHandleResponse: true });
};

// 更改账号状态
export const personnelStatusChange = (data) => {
  return post(service + '/company/user/forbidden', data);
};

// 删除附件
export const deleteFileAnnex = (data, config) => {
  return deleteFn(service + '/company/user/file-delete', data, config);
};

// 重置密码
export const personnelResetPwd = (data) => {
  return put(service + '/company/user/resetPwd', data, { skipHandleResponse: true });
};
