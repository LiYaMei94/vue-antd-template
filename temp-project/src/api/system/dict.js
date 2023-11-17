import { get, post, put, deleteFn } from '@/lib/axios';
const service = process.env.VUE_APP_BASE_API_8080;

/* ===========================================================数据字典=========================================================== */
// 更新字典类型
export const systemDictUpdate = (data) => {
  return put(service + '/system/dict/type', data);
};

// 新增字典类型
export const systemDictCreate = (data) => {
  return post(service + '/system/dict/type', data);
};

// 字典详情
export const systemDictDetail = (data) => {
  return get(service + '/system/dict/type/query', data);
};

// 字典列表
export const systemDictList = (data) => {
  return get(service + '/system/dict/type/list', data);
};

// 字典删除
export const systemDictDelete = (data) => {
  return deleteFn(service + '/system/dict/type/remove', data, { skipHandleResponse: true });
};

// 更新字典数据
export const systemDictDataUpdate = (data) => {
  return put(service + '/system/dict/data', data);
};

// 新增字典数据
export const systemDictDataCreate = (data) => {
  return post(service + '/system/dict/data', data);
};

// 字典数据详情
export const systemDictDataDetail = (data) => {
  return get(service + '/system/dict/data/query', data);
};

// 字典数据列表
export const systemDictDataList = (data) => {
  return get(service + '/system/dict/data/list', data);
};

// 字典数据删除
export const systemDictDataDelete = (data) => {
  return deleteFn(service + '/system/dict/data/remove', data, { skipHandleResponse: true });
};

// 字典数据排序
export const systemDictDataSort = (data) => {
  return put(service + '/system/dict/data/sort', data);
};

// 字典数据排序
export const getDictDataValue = (data) => {
  return get(service + '/system/dict/data/drop-down-selection', data);
};
