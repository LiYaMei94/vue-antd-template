import dayjs from 'dayjs';

/**
 * 时间转字符串
 * @param {*} date
 * @param {*} format
 * @returns
 */
export const dateFormat = (date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

/**
 * 时间转时间戳 unix 秒 valueOf 毫秒
 * @param {*} date
 * @param {*} isUnix 是否到秒
 */
export const getTime = (date, isUnix = true) => {
  return isUnix ? dayjs(date).unix() : dayjs(date).valueOf();
};
