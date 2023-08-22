import { notification } from 'ant-design-vue';
import _ from 'lodash';

export const isString = (value) => {
  return Object.prototype.toString.call(value) === '[object String]';
};

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
  // 判断是否输出的结果为 group 类型
  if (type == 'group') {
    return filterData ? filterData : { [value]: callValue };
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
  if (json) {
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
  }
};

/**
 * 网络请求业务自己处理响应数据
 * @param {*} options
 * @returns
 */
export const resultCallBack = (options) => {
  const { result, successMessage } = options || {};
  return new Promise((resolve, reject) => {
    const { code, data: res, message, msg } = result || {};
    if (code && Number(code) === 200) {
      notification['success']({
        message: '错误提示',
        description: successMessage || res?.message || res.msg || message || msg || '操作成功'
      });
      return resolve(res);
    } else {
      notification['error']({
        message: '错误提示',
        description: res?.message || res.msg || message || msg
      });
    }
  });
};

/**
 * 根据指定key和value查找树形数据对应的上级数据
 * @param {*} treeData
 * @param {*} nodeKey
 * @param {*} parentValue
 * @returns
 */
export const findTreeData = (treeData, nodeKey, parentValue) => {
  let hasFound = false, // 表示是否有找到key值
    result = null;
  const fn = function (data) {
    if (Array.isArray(data) && !hasFound) {
      // 判断是否是数组并且没有的情况下，
      data.forEach((item) => {
        if (item[nodeKey] === parentValue) {
          // 数据循环每个子项，并且判断子项下边是否有key值
          result = item; // 返回的结果等于每一项
          hasFound = true; // 并且找到key值
        } else if (item.children) {
          fn(item.children); // 递归调用下边的子项
        }
      });
    }
  };
  fn(treeData); // 调用一下
  return result;
};

/**
 * 一维数组转树形
 * @param {*} arr
 * @returns
 */
export const arrayToTree = (arr, id, parentId) => {
  const result = [];
  //判断参数是否为数组
  if (!Array.isArray(arr)) {
    return result;
  }
  //防止参数对象数组中，存在children
  arr.forEach((item) => {
    delete item.children;
  });
  //id为key
  let map = new Map();
  arr.forEach((item) => {
    map.set(item[id], item);
  });
  //parentId为父节点
  arr.forEach((item) => {
    if (map.has(item[parentId])) {
      let parent = map.get(item[parentId]);
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

/**
 * 树形数据转一维数组
 * @param {*} source
 * @returns
 */
export const treeToArr = (source) => {
  if (!Array.isArray(source)) return [];
  let res = [];
  source?.forEach((el) => {
    res.push(el);
    el.children && res.push(...treeToArr(el.children));
  });
  return res;
};

/**
 * 根据指定的层级和key值返回对应的数据
 * @param {*} tree
 * @param {*} key
 * @param {*} level
 */
export const getTreeDataValues = (tree, key, level) => {
  const result = [];
  const fun = (data, n = 0) => {
    n++;
    _.forEach(data, (item) => {
      item.level = n;
      if (item.level <= level) {
        if (!isNull(key)) result.push(item[key]);
        if (item?.children?.length) fun(item?.children, n);
      }
    });
  };
  fun(tree);
  return result;
};

/**
 * 根据父节点找当前节点的所有父辈节点
 * @param {*} treeData 树形数据
 * @param {*} parentKey 父节点名称
 * @param {*} nodeKey 节点名称
 * @param {*} parentValue 初始父节点值
 * @param {*} parentKeys 所有长辈节点
 * @returns
 */
export const getTreeRootKeys = (treeData, parentKey, nodeKey, parentValue, parentKeys = [], isTag = true) => {
  // console.log('treeData, parentKey, nodeKey, parentValue', treeData, parentKey, nodeKey, parentValue);
  const fun = function (value) {
    const result = findTreeData(treeData, nodeKey, value);
    if (JSON.stringify(result) !== '{}' && result) {
      isTag ? parentKeys.push(result[parentKey]) : parentKeys.push(result);
      fun(result[parentKey]);
    }
    return;
  };
  fun(parentValue);
  return parentKeys;
};
