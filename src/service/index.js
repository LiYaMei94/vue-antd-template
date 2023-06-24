import axios from 'axios';
import store from '@/store';
import db from '@/utils/db';
import { ACCESS_TOKEN } from '@/utils/const';
import { notification } from 'ant-design-vue'; // FIXME:提示可根据自己的需要更换
import { isObject } from '@/utils/utils';

const DB = new db();

const service = axios.create({
  // FIXME:如果是多个baseURL关闭此处，在api调用是加入
  baseURL: process.env.VUE_APP_BASE_API,
  responseType: 'json',
  skipHandleResponse: false //默认不跳过数据处理
});

/**
 * 异常拦截处理器
 * @param {*} error
 */
const errorHandler = (error) => {
  if (error.response) {
    const error = {};
    const { status, data } = error.response || {};
    switch (status) {
      case 400:
        error = {
          message: '请求失败！请您稍后重试'
        };
        break;
      case 401:
        // TODO:跳转登录
        error = {
          message: '登录失效！请您重新登录'
        };
        break;
      case 403:
        error = {
          message: '当前账号无权限访问！'
        };
        break;
      case 404:
        error = {
          message: '你所访问的资源不存在！'
        };
        break;
      case 405:
        error = {
          message: '请求方式错误！请您稍后重试'
        };
        break;
      case 408:
        break;
      case 500:
        error = {
          message: '服务异常！'
        };
        break;
      case 502:
        error = {
          message: '网关错误！'
        };
        break;
      case 503:
        error = {
          message: '服务不可用！'
        };
        break;
      case 504:
        error = {
          message: '网关超时！'
        };
        break;
      default:
        error = {
          message: '请求失败！'
        };
    }

    notification.error({
      description: data.message,
      ...error
    });
  }
  return Promise.reject(error);
};

/**
 * 移除空字符串，null, undefined
 * @param {*} config
 */
const clearEmptyParam = (config) => {
  ['data', 'params'].forEach((item) => {
    if (config[item]) {
      const keys = Object.keys(config[item]);
      if (keys.length) {
        keys.forEach((key) => {
          if (['', undefined, null].includes(config[item][key]) && isObject(config[item])) {
            delete config[item][key];
          }
        });
      }
    }
  });
};

request.interceptors.request.use((config) => {
  const token = DB.getLocal(ACCESS_TOKEN);
  // FIXME:如果 token 存在,让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers[ACCESS_TOKEN] = token;
  }
  clearEmptyParam(config);
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  const result = response?.data || {};
  const { code, data } = result || {};
  const { skipHandleResponse = false } = response?.config || {};
  if (!skipHandleResponse && code === 200) {
    return data;
  }

  if (!skipHandleResponse && code !== 200) {
    errorHandler(result);
  }
  return response.data;
}, errorHandler);

/**
 * get 请求
 * @param url
 * @param data
 * @param options
 * @returns
 */
export const get = (url, data, options) => {
  return instance.get(url, {
    params: data,
    ...options
  });
};

/**
 *
 * @param url post 请求
 * @param data
 * @param options
 * @returns
 */
export const post = (url, data, options) => {
  return instance.post(
    url,
    {
      ...data
    },
    options
  );
};

export default service;
