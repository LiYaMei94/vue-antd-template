import { get, post, put, deleteFn } from '@/lib/axios';
import DB from '@/utils/db';

const service = process.env.VUE_APP_BASE_API_8080;

// 懒加载省市区
export const getRegionData = (data) => {
  return get(service + '/region/lazy-tree', data);
};
