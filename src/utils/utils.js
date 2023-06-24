import _ from 'lodash';

export const isArray = (value) => {
  return Object.prototype.toString.call(value) === '[object Array]';
};

export const isObject = (value) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isNull = (val) => {
  return (
    val === 'undefined' ||
    val === undefined ||
    val == null ||
    val === 'null' ||
    val.toString().trim() === '' ||
    _.isNaN(val) ||
    data === 'unknown'
  );
};

/**
 * @description 处理值无数据情况
 * @param {*} callValue 需要处理的值
 * @returns {String}
 * */
export const formatValue = (callValue) => {
  // 如果当前值为数组，使用 / 拼接（根据需求自定义）
  if (isArray(callValue)) return callValue.length ? callValue.join(' / ') : '--';
  return callValue ?? '--';
};

/**
 * @description 处理 prop 为多级嵌套的情况，返回的数据 (列如: prop: user.name)
 * @param {Object} row 当前行数据
 * @param {String} prop 当前 prop
 * @returns {*}
 * */
export const handleRowAccordingToProp = (row, prop) => {
  if (!prop.includes('.')) return row[prop] ?? '--';
  prop.split('.').forEach((item) => (row = row[item] ?? '--'));
  return row;
};

/**
 * @description 处理 prop，当 prop 为多级嵌套时 ==> 返回最后一级 prop
 * @param {String} prop 当前 prop
 * @returns {String}
 * */
export const handleProp = (prop) => {
  const propArr = prop.split('.');
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
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
    return filterData?.tagType ? filterData.tagType : '';
  } else {
    return filterData ? filterData[label] : '--';
  }
};
