import { get, post, put, deleteFn, upload, download } from '@/lib/axios';
import { updateEmptyStringValue, treeToArr } from '@/utils/utils';
import _ from 'lodash';

const service = process.env.VUE_APP_BASE_API_8080;

// 修改
export const companyUpdate = (data) => {
  return put(service + '/company/edit', data);
};

// 新增
export const companyAdminCreate = (data) => {
  return post(service + '/company/administrator/add', data);
};

// 详情
export const companyDetail = async (data) => {
  const detail = await get(service + '/company/detail', data);
  updateEmptyStringValue(detail?.data);
  return detail;
};
// 企业所有用户列表
export const personnelList = async (data) => {
  return await get(service + '/company/administrator/user/List', data);
};
// 根据userId查询企业角色
export const companyRolelList = async (data) => {
  return await get(service + '/company/administrator/role/List', data);
};
// 列表
export const companyAdminList = async (data) => {
  return await get(service + '/company/administrator/list', data);
};
// 根据企业id查询组织列表
export const organizationList = async (data) => {
  const result = await get(service + '/company/administrator/org/list', data);
  const dataList = treeToArr(_.cloneDeep(result.data));
  return { ...result, data: dataList, treeData: result.data };
};
// 删除
export const companyAdminDelete = (data) => {
  return deleteFn(service + '/company/administrator/remove', data, { skipHandleResponse: true });
};
// 分配公司角色给企业管理员
export const companyAdminAssignRole = (data) => {
  return post(service + '/company/administrator/assign/role', data);
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
