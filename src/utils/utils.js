import { message as Message } from 'ant-design-vue';
import _ from 'lodash';

export const isNumber = (value) => {
  return Object.prototype.toString.call(value) === '[object Number]';
};

export const isArray = (value) => {
  return Object.prototype.toString.call(value) === '[object Array]';
};

export const isObject = (value) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isNull = (val) => {
  return (
    val === 'undefined' || val === undefined || val == null || val === 'null' || val.toString().trim() === '' || _.isNaN(val) || val === 'unknown'
  );
};

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 字典列表
 * @param {Array} fieldNames label && value && children 的 key 值
 * @param {String} type 过滤类型（目前只有 tag）
 * @returns {String}
 * */
export const filterEnum = (callValue, enumData, fieldNames, type) => {
  const value = fieldNames?.value ?? 'value';
  const label = fieldNames?.label ?? 'label';
  const children = fieldNames?.children ?? 'children';
  let filterData = {};
  // 判断 enumData 是否为数组
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, callValue, value, children);
  // 判断是否输出的结果为 tag 类型
  if (type == 'tag') {
    return filterData?.tagType ? filterData.tagType : callValue;
  } else {
    return filterData ? filterData[label] : callValue;
  }
};

/**
 * @description 递归查找 callValue 对应的 enum 值
 * */
export const findItemNested = (enumData, callValue, value, children) => {
  return enumData.reduce((accumulator, current) => {
    if (accumulator) return accumulator;
    if (current[value] === callValue) return current;
    if (current[children]) return findItemNested(current[children], callValue, value, children);
  }, null);
};

/**
 * html展示json
 */
export const syntaxHighlight = (json) => {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

/**
 * 网络请求业务自己处理响应数据
 * @param {*} options
 * @returns
 */
export const resultCallBack = (options) => {
  const { result, successMessage } = options || {};
  return new Promise((resolve, reject) => {
    const { code, data: res, message } = result || {};
    if (code && Number(code) === 200) {
      Message.success(successMessage || '操作成功');
      return resolve(res);
    } else {
      Message.error(message);
    }
  });
};

export const buildShortUUID = (prefix = '') => {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  return prefix + '_' + random + String(time);
};
