import { isArray } from '@/utils/utils';
// 符合一个权限就展示
export const somePermission = {
  mounted(el, binding) {
    const { value } = binding;
    //TODO:后端返回的按钮权限
    const permissionButton = ['add', 'update', 'delete'];
    if (isArray(value) && value.length > 0) {
      const somePermission = permissionButton.some((role) => {
        return value.includes(role);
      });
      if (!somePermission) {
        el.style.display = 'none';
      }
    } else {
      throw new Error('No permission !');
    }
  }
};

export const everyPermission = {
  mounted(el, binding) {
    const { value } = binding;
    //TODO:后端返回的按钮权限
    const permissionButton = ['add', 'update', 'delete'];
    if (isArray(value) && value.length > 0) {
      const somePermission = permissionButton.every((role) => {
        return value.includes(role);
      });
      if (!somePermission) {
        el.style.display = 'none';
      }
    } else {
      throw new Error('No permission !');
    }
  }
};
