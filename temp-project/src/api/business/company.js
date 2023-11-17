import { get, post, put, deleteFn, upload, download } from '@/lib/axios';
import { updateEmptyStringValue } from '@/utils/utils';

const service = process.env.VUE_APP_BASE_API_8080;

// 修改
export const companyUpdate = (data) => {
  return put(service + '/company/edit', data);
};

// 新增
export const companyCreate = (data) => {
  return post(service + '/company/add', data);
};

// 详情
export const companyDetail = async (data) => {
  const detail = await get(service + '/company/detail', data);
  updateEmptyStringValue(detail?.data);
  return detail;
};

// 列表
export const companyList = async (data) => {
  return await get(service + '/company/list', data);
};

// 删除
export const companyDelete = (data) => {
  return deleteFn(service + '/company/delete', data, { skipHandleResponse: true });
};

// 上传营业执照
export const uploadFusinessLicense = (data, config) => {
  return upload(service + '/company/business-license', data, config);
};

// 删除附件
export const deleteFileAnnex = (data, config) => {
  return deleteFn(service + '/company/file-delete', data, config);
};

// 企业枚举
export const companyEnum = (data) => {
  return get(service + '/company/select-down/list', data);
};
