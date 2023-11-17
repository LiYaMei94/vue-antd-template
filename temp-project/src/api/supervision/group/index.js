import { get, post, put, deleteFn } from '@/lib/axios';
import _ from 'lodash';

const service = process.env.VUE_APP_BASE_API_8080;

// 列表
export const supervisionGroupList = (data) => {
  return get(service + '/supervision/org/list', data);
};
