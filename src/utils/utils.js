import _ from 'lodash';

export const isNull = (val) => {
  return (
    val === 'undefined' ||
    val === undefined ||
    val === null ||
    val === 'null' ||
    val.toString().trim() === '' ||
    _.isNaN(val)
  );
};

/**
 *
 * @param {*} data
 * @param {*} keysArray 需要输出的key
 * @param {*} level
 * @returns
 */
export const _flatten = (data, keysArray, level = 0) => {
  return data.reduce((totalArray, itemArray) => {
    return [
      ...totalArray,
      keysArray.reduce(
        (totalObject, key) => {
          totalObject[key] = itemArray[key];
          return totalObject;
        },
        {
          level
        }
      ),
      // 递归调用flatten函数，并且打散递归返回结果的数组，使其扁平化。
      ..._flatten(itemArray.children || [], keysArray, level + 1)
    ];
  }, []);
};
