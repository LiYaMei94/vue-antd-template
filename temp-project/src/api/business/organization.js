import { get, post, put, deleteFn } from '@/lib/axios';
import { updateEmptyStringValue, treeToArr } from '@/utils/utils';
import _ from 'lodash';

const service = process.env.VUE_APP_BASE_API_8080;

// 修改
export const organizationUpdate = (data) => {
  return put(service + '/company/org', data);
};

// 新增
export const organizationCreate = (data) => {
  return post(service + '/company/org', data);
};

// 详情
export const organizationDetail = async (data) => {
  const detail = await get(service + '/company/org/query', data);
  updateEmptyStringValue(detail?.data);
  return detail;
};

// 列表
export const organizationList = async (data) => {
  const result = await get(service + '/company/org/list', data);
  const dataList = treeToArr(_.cloneDeep(result.data));
  return { ...result, data: dataList, treeData: result.data };
};

// 删除
export const organizationDelete = (data) => {
  return deleteFn(service + '/company/org/remove', data, { skipHandleResponse: true });
};

// 列表
export const treeList = async (data) => {
  const result = await get(service + '/all/company/org/list', data);
  const addKey = (arr) =>
    arr.map((item) => ({
      ...item,
      isLeaf: !item?.hasChildren
    }));
  return { data: addKey(result?.data || []) };
};
