import axios from 'axios';
import DB from '@/utils/db';
import { ACCESS_TOKEN } from '@/utils/const';
import { notification } from 'ant-design-vue'; // FIXME:提示可根据自己的需要更换
import { isNull } from '@/utils/utils';
import router from '@/router';
import store from '@/store';
import _ from 'lodash';

const isPermission = process.env?.VUE_APP_route_permission === 'true';
const instance = axios.create({
  // FIXME:如果是多个baseURL关闭此处，在api调用是加入
  // baseURL: process.env.VUE_APP_BASE_API, // 打包时使用
  // baseURL: '/api', // 本地开发联调跨域时使用代理
  responseType: 'json',
  skipHandleResponse: false //默认不跳过数据处理
});

/**
 * 异常拦截处理器
 * @param {*} error
 */
const errorHandler = (error) => {
  if (error) {
    let errorMap = {};
    const { status, data, code, message, msg } = error.response || error || {};
    const newCode = Number(status || code);
    const newMessage = data?.message || data?.msg || message || msg;
    switch (newCode) {
      case 400:
        errorMap = {
          message: '请求失败！请您稍后重试'
        };
        break;
      case 401:
        errorMap = {
          message: '登录失效！请您重新登录'
        };
        break;
      case 403:
        errorMap = {
          message: '当前账号无权限访问！'
        };
        break;
      case 404:
        errorMap = {
          message: '你所访问的资源不存在！'
        };
        break;
      case 405:
        errorMap = {
          message: '请求方式错误！请您稍后重试'
        };
        break;
      case 500:
        errorMap = {
          message: '服务异常！'
        };
        break;
      case 502:
        errorMap = {
          message: '网关错误！'
        };
        break;
      case 503:
        errorMap = {
          message: '服务不可用！'
        };
        break;
      case 504:
        errorMap = {
          message: '网关超时！'
        };
        break;
      default:
        errorMap = {
          message: '操作失败！'
        };
    }

    const key = 'errorNotification';
    notification.error({
      description: newMessage,
      ...errorMap,
      key
    });
    if (newCode === 401) {
      DB.deleteLocal(ACCESS_TOKEN);
      DB.deleteSession(ACCESS_TOKEN);
      store.dispatch('clearMenuInfo');
      setTimeout(() => {
        notification.close(key);
        isPermission && router.push('/user/login');
      }, 1000);
    }
  }

  throw error;
};

/**
 * 递归将空字符串，null, undefined、'undefined','null','unknown'
 * @param {*} config
 */
const clearEmptyParam = (config) => {
  ['data', 'params'].forEach((item) => {
    const fn = (data) => {
      if (typeof data === 'object') {
        if (Array.isArray(data)) {
          for (let item of data) {
            fn(item);
          }
        } else {
          for (let key in data) {
            if (data[key] === undefined || data[key] === null || _.isNaN(data[key])) {
              // FIXME:null、undefined、''一致传''，根据合作后端选择值类型
              data[key] = '';
              // data[key] = null;
              // delete data[key];
            } else if (typeof data[key] === 'object') {
              fn(data[key]);
            }
          }
        }
      }
    };
    fn(config[item]);
  });
};

instance.interceptors.request.use((config) => {
  const token = DB.getSession(ACCESS_TOKEN) || DB.getLocal(ACCESS_TOKEN);
  // FIXME:如果 token 存在,让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  clearEmptyParam(config);
  return config;
}, errorHandler);

instance.interceptors.response.use((response) => {
  const result = response?.data || {};
  const { skipHandleResponse = false } = response?.config || {};
  const headers = response.headers;

  // 接收文件流
  if (
    !skipHandleResponse &&
    response?.status === 200 &&
    (headers['content-type']?.includes('octet-stream') || headers['content-type']?.includes('form-data'))
  ) {
    const contentDisposition = decodeURIComponent(headers['content-disposition'].match(/=(.*)$/)[1]);
    const fileName =
      (!isNull(decodeURIComponent(headers['download-filename'])) && decodeURIComponent(headers['download-filename'])) ||
      (!isNull(contentDisposition) && contentDisposition) ||
      'file';
    return { file: result, fileName };
  }

  // 其他数据
  const { code, data, rows, total, pageNum, pageSize } = result || {};
  if (!skipHandleResponse && code == 200) {
    return { data: data || rows, total, pageNum, pageSize };
  }

  if (!skipHandleResponse && code != 200) {
    errorHandler(result, true);
  }
  return result;
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

/**
 *
 * @param url delete 请求
 * @param data
 * @param options
 * @returns
 */
export const deleteFn = (url, data, options) => {
  return instance.delete(url, {
    params: data,
    ...options
  });
};

/**
 *
 * @param url put 请求
 * @param data
 * @param options
 * @returns
 */
export const put = (url, data, options) => {
  return instance.put(url, data, options);
};

/**
 *
 * @param url upload 请求
 * @param data
 * @param options
 * @returns
 */
export const upload = (url, data, options) => {
  return instance.post(url, data, options);
};

/**
 *
 * @param url download 请求
 * @param data
 * @param options
 * @returns
 */
export const download = (url, data, options) => {
  return instance.get(url, {
    params: data,
    responseType: 'blob',
    ...options
  });
};

export default instance;
