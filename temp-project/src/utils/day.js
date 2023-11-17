import dayjs from 'dayjs';
import { isNull } from './utils';

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 时间转字符串
 * @param {*} date
 * @param {*} format
 * @returns
 */
export const dateFormat = (date, format = DATE_FORMAT) => {
  if (isNull(date) || date == 0) return '';
  return dayjs(date).format(format);
};

/**
 * 时间转时间戳 unix 秒 valueOf 毫秒
 * @param {*} date
 * @param {*} isUnix 是否到秒，默认是毫秒
 */
export const getTime = (date, isUnix = false) => {
  if (isNull(date) || date == 0) return '';
  return isUnix ? dayjs(date).unix() : dayjs(date).valueOf();
};

/**
 * 转时间格式
 * @param {*} 时间戳 或时间字符串
 */
export const getMomentDate = (date) => {
  if (isNull(date) || date == 0) return null;
  return dayjs(date);
};
