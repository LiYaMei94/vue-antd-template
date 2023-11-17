import { isNull, findTreeData } from '@/utils/utils';
import { CONST_STRING_1 } from '@/utils/const';
import _ from 'lodash';

/**
 * 根据parentId更新当前节点的path、perms
 * @param {*} treeData
 * @param {*} parentId
 * @param {*} detail
 * @returns
 */
export const updateFormData = (treeData, detail) => {
  try {
    const detailInfo = _.cloneDeep(detail) || {};
    const perms = detailInfo?.permsValue || detailInfo?.perms;
    const path = detailInfo?.pathValue || detailInfo?.path;
    let permsArr = [];
    let permsBefore = '';
    let permsValue = perms || '';
    let pathArr = [];
    let pathBefore = '';
    let pathValue = path || '';

    if (isNull(detailInfo?.parentId)) return { permsBefore, permsValue, pathBefore, pathValue };

    // 获取上级节点信息
    const parent = findTreeData(treeData, 'id', detailInfo?.parentId);

    // 权限标识
    if (!isNull(parent?.perms)) {
      permsBefore = `${parent?.perms}:`;
      permsArr = _.filter(perms?.split(permsBefore), (item) => !isNull(item));
      permsValue = permsArr?.length ? permsArr[0] : perms;
    }

    // 路由地址
    if (!isNull(parent?.path)) {
      // 不是外链
      if (parent?.isFrame !== CONST_STRING_1) {
        pathBefore = `${parent?.path}/`;
        pathArr = _.filter(path?.split(pathBefore), (item) => !isNull(item));
        pathValue = pathArr?.length ? pathArr[0] : path;
      } else {
        // 外链
      }
    }
    return { permsBefore, permsValue, pathBefore, pathValue };
  } catch (error) {
    console.error('menu-utils-updateFormData', error);
  }
};

export const formItemTip = {
  icon: '将Ant Design Vue 图标中单个图标名称输入文本框，大驼峰和中划线命名方式均可。示例：【icon-question-circle或IconQuestionCircle】',
  isFrame: '选择是外链则路由地址需要以`http(s)://`开头',
  path: '访问的路由地址，如：`/user`，如果是外网地址则以`http(s)://`开头，打开新页面访问',
  redirectPath: '父级菜单的重定向地址，如：`/user`。不填默认第一个子路由',
  perms: '后端接口中定义的权限字符，如：system:user:list',
  component: '访问的组件路径，如：`system/user/index`，默认在`views`目录下',
  visible: '选择隐藏则路由将不会出现在侧边栏，但仍然可以访问',
  pageLayout: '菜单布局：全屏(数据大屏页面) 、非全屏'
};
