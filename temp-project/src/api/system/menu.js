import { get, post, put, deleteFn } from '@/lib/axios';
import { arrayToTree } from '@/utils/utils';

const service = process.env.VUE_APP_BASE_API_8080;

// 修改菜单
export const systemMenuUpdate = (data) => {
  return put(service + '/system/menu', data);
};

// 新增菜单
export const systemMenuCreate = (data) => {
  return post(service + '/system/menu', data);
};

// 菜单下拉树列表:获取业务菜单树,新增菜单时寻找上级使用
export const systemMenuTreeSelect = (data) => {
  return get(service + '/system/menu/getMenuTree', data);
};

// 菜单详情
export const systemMenuDetail = (data) => {
  return get(service + '/system/menu/query', data);
};

// 菜单列表
export const systemMenuList = async (data) => {
  const result = await get(service + '/system/menu/list', data);
  return { ...result, data: arrayToTree(result.data, 'menuId', 'parentId') };
};

// 菜单删除
export const systemMenuDelete = (data) => {
  return deleteFn(service + '/system/menu/remove', data, { skipHandleResponse: true });
};

// 角色可分配菜单树，给角色分配菜单功能点时使用
export const getMenuFunctionTree = async (data) => {
  return get(service + '/system/menu/getMenuFunctionTree', data);
};
