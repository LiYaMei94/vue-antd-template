import { isNull } from '@/utils/utils';
import state from '@/store';
import { useStore } from 'vuex';

const isPermission = process.env?.VUE_APP_route_permission === 'true';

// 符合一个权限就展示
export const someHidden = {
  mounted(el, binding) {
    try {
      if (!isPermission) {
        return;
      }
      const { value } = binding;
      const permissionButton = state?.state?.user?.buttonList || [];
      const newValue = Array.isArray(value) ? value : !isNull(value) ? [value] : [];
      if (newValue.length > 0) {
        const somePermission = permissionButton.some((role) => {
          return newValue.includes(role);
        });
        if (!somePermission) {
          el.style.display = 'none';
        }
      } else {
        throw new Error('No permission !');
      }
    } catch (error) {
      console.log('directives-permission-somePermission', error);
    }
  }
};

// 所有权限都符合再展示
export const everyHidden = {
  mounted(el, binding) {
    try {
      if (!isPermission) {
        return;
      }
      const { value } = binding;
      const { state } = useStore();
      const permissionButton = state?.state?.user?.buttonList || [];
      const newValue = Array.isArray(value) ? value : !isNull(value) ? [value] : [];
      if (newValue.length > 0) {
        const somePermission = permissionButton.every((role) => {
          return newValue.includes(role);
        });
        if (!somePermission) {
          el.style.display = 'none';
        }
      } else {
        throw new Error('No permission !');
      }
    } catch (error) {
      console.log('directives-permission-everyPermission', error);
    }
  }
};

export const someDisabled = {
  mounted(el, binding) {
    try {
      if (!isPermission) {
        return;
      }
      const { value } = binding;
      const permissionButton = state?.state?.user?.buttonList || [];
      const newValue = Array.isArray(value) ? value : !isNull(value) ? [value] : [];
      if (newValue.length > 0) {
        const somePermission = permissionButton.some((role) => {
          return newValue.includes(role);
        });
        if (!somePermission) {
          el.classList.add('table-custom-primary-disabled');
        }
      } else {
        throw new Error('No permission !');
      }
    } catch (error) {
      console.log('directives-permission-disabledPermission', error);
    }
  }
};

export const everyDisabled = {
  mounted(el, binding) {
    try {
      if (!isPermission) {
        return;
      }
      const { value } = binding;
      const permissionButton = state?.state?.user?.buttonList || [];
      const newValue = Array.isArray(value) ? value : !isNull(value) ? [value] : [];
      if (newValue.length > 0) {
        const somePermission = permissionButton.every((role) => {
          return newValue.includes(role);
        });
        if (!somePermission) {
          el.classList.add('table-custom-primary-disabled');
        }
      } else {
        throw new Error('No permission !');
      }
    } catch (error) {
      console.log('directives-permission-disabledPermission', error);
    }
  }
};
