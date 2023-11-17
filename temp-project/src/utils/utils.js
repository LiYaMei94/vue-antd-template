import { notification } from 'ant-design-vue';
import _ from 'lodash';
import Modal from '@/components/Modal';

export const isDate = (value) => {
  return Object.prototype.toString.call(value) === '[object Date]';
};

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

export const isBoolean = (value) => {
  return Object.prototype.toString.call(value) === '[object Boolean]';
};

export const isFunction = (value) => {
  return Object.prototype.toString.call(value) === '[object Function]';
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
    return filterData ? filterData : callValue;
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
 * 网络请求业务自己处理响应数据 notification
 * @param {*} options
 * @returns
 */
export const resultCallBack = (result, successMessage) => {
  return new Promise((resolve, reject) => {
    const { code, data: res, message, msg } = result || {};
    if (code && Number(code) === 200) {
      notification['success']({
        message: '操作成功',
        description: successMessage || message || msg || res?.message || res?.msg || '操作成功'
      });
      return resolve(res);
    } else {
      notification['error']({
        message: '操作失败',
        description: res?.message || res?.msg || message || msg
      });
      return reject(error);
    }
  });
};

/**
 * 删除网络请求业务自己处理响应数据
 * @param {*} options
 * @returns
 */
export const deleteCallBack = (result, title = '删除提示') => {
  return new Promise((resolve, reject) => {
    const { code, data: res, message, msg } = result || {};
    if (code && Number(code) === 400) {
      Modal.info({ title, content: message || msg || res?.message || res?.msg });
      return reject(res);
    } else if (code && Number(code) === 500) {
      Modal.error({ title: '删除失败', content: message || msg || res?.message || res?.msg });
      return reject(result);
    }
    return resolve(res);
  });
};

/**
 * 根据指定key和value查找树形数据对应的上级数据
 * @param {*} treeData
 * @param {*} nodeKey
 * @param {*} nodeValue
 * @returns
 */
export const findTreeData = (treeData, nodeKey, nodeValue, childName = 'children') => {
  let hasFound = false, // 表示是否有找到key值
    result = null;
  const fn = function (data) {
    if (Array.isArray(data) && !hasFound) {
      // 判断是否是数组并且没有的情况下，
      data.forEach((item) => {
        if (item[nodeKey] === nodeValue) {
          // 数据循环每个子项，并且判断子项下边是否有key值
          result = item; // 返回的结果等于每一项
          hasFound = true; // 并且找到key值
        } else if (item[childName]) {
          fn(item[childName]); // 递归调用下边的子项
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
 * 树形数据添加层级
 * @param {*} array
 * @param {*} levelName
 * @param {*} childrenName
 * @returns
 */
export const arrayTreeAddLevel = (array, levelName = 'level', childrenName = 'children') => {
  if (!Array.isArray(array)) return [];
  const recursive = (array, level = 0) => {
    level++;
    return array.map((v) => {
      v[levelName] = level;
      const child = v[childrenName];
      if (child && child.length) recursive(child, level);
      return v;
    });
  };
  return recursive(array);
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
    const newEl = _.cloneDeep(el);
    res.push(el);
    newEl?.children && res.push(...treeToArr(newEl?.children));
  });
  return res;
};

/**
 * 将树型数据展开指定的级数
 * @param {*} tree
 * @param {*} key
 * @param {*} level
 */
export const getExpandedTreeByNumber = (tree, key, level) => {
  const result = [];
  const fun = (data, n = 0) => {
    n++;
    _.forEach(data, (item) => {
      item.level = item?.level || n;
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
 * 文件流下载
 * @param {*} fileStream
 * @param {*} fileName
 */
export const blobDownloadFile = (fileStream, fileName, type = '') => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([fileStream], { type });
      const a = document.createElement('a');
      const URL = window.URL || window.webkitURL;
      const href = URL.createObjectURL(blob);
      a.href = href;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(href);
      resolve();
    } catch (error) {
      console.error('utils-blobDownloadFile', error);
      reject(error);
    }
  });
};

/**
 * 文件流生成src预览
 * @param {*} fileStream
 * @param {*} fileName
 */
export const blobPreviewFile = (fileStream, fileName, type = '') => {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([fileStream], { type });
      const URL = window.URL || window.webkitURL;
      const href = URL.createObjectURL(blob);
      resolve({ url: href, fileName, fileSize: blob.size });
      // URL.revokeObjectURL(href);
    } catch (error) {
      console.error('utils-blobPreviewFile', error);
      reject(error);
    }
  });
};

/**
 * 递归清除空值
 * @param {*} object
 * @param {*} contain
 */
export const clearObjectEmpty = (object, contain) => {
  const copyObj = _.cloneDeep(object);
  if (!isObject(copyObj)) {
    return copyObj;
  }
  const fn = (data) => {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        for (let item of data) {
          fn(item);
        }
      } else {
        for (let key in data) {
          if (!isNull(contain) && !contain?.includes(key)) {
            delete data[key];
          }
          if (isNull(data[key])) {
            delete data[key];
          } else if (typeof data[key] === 'object') {
            fn(data[key]);
          }
        }
      }
    }
  };
  fn(copyObj);
  return copyObj;
};

/**
 * 校验字符串长度是否符合规则
 * @param {*} str
 * @param {*} min
 * @param {*} max
 */
export const checkLength = (str, min, max) => {
  return str.length >= min && str.length <= max;
};

/**
 * tree 根据指定ID 修改指定 key 的值
 * @param {*} tree
 * @param {*} id
 * @param {*} changeKey
 * @param {*} changeValue
 * @returns
 */
export const changeTreePositionData = ({ tree, idKey = 'id', idValue, changeKey, changeValue }) => {
  try {
    if (tree[0][idKey] === idValue) {
      // 根节点判定
      tree[0][changeKey] = changeValue;

      return tree;
    }
    const searchId = (source, id) => {
      // 开启递归
      for (let i = 0; i < source.length; i++) {
        const item = source[i];
        if (item[idKey] === id) {
          item[changeKey] = changeValue;
          return;
        }
        if (item.children) {
          // 只对非末端节点进行递归
          searchId(item.children, id);
        }
      }
    };
    searchId(tree, idValue);

    return tree;
  } catch (error) {
    console.log('error', error);
  }
};

/**
 * 获取树的所有叶子节点
 * @param {*} tree,树型数组
 */
export const getAllLeafNodes = (treeData) => {
  const result = [];
  const fn = function (treeData) {
    for (let item in treeData) {
      if (treeData[item].children) {
        fn(treeData[item].children);
      } else {
        result.push(treeData[item]);
      }
    }
  };
  fn(treeData); // 调用一下
  return result;
};

/**
 * 根据当前节点的key 获取父辈节点的key
 * @param {*} key
 * @param {*} tree
 * @returns
 */
export const getParentKeys = (key, tree, keyStr = 'key') => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item[keyStr] === key)) {
        parentKey = node[keyStr];
      } else if (getParentKeys(key, node.children, keyStr)) {
        parentKey = getParentKeys(key, node.children, keyStr);
      }
    }
  }
  return parentKey;
};

/**
 * 将详情接口的空字符串置换为null
 * @param {*} Object
 */
export const updateEmptyStringValue = (Object) => {
  const fn = (data) => {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        for (let item of data) {
          fn(item);
        }
      } else {
        for (let key in data) {
          if (isString(data[key])) {
            if (data[key].toString().trim() === '') {
              data[key] = null;
            } else if (typeof data[key] === 'object') {
              fn(data[key]);
            }
          }
        }
      }
    }
  };
  fn(Object);
};
