import { useStore } from 'vuex';
import { CONST_STRING_0, ENABLE_DISABLE_STATUS_ENUM } from '@/utils/const';
import { filterEnum, isObject } from '@/utils/utils';

const isPermission = process.env?.VUE_APP_route_permission === 'true';
const StatusSwitch = (props, context) => {
  const {
    auth = [],
    text,
    handleStatusChange,
    checkedChildren = '启用',
    unCheckedChildren = '停用',
    options = ENABLE_DISABLE_STATUS_ENUM,
    type = 'some',
    params = {},
    disabled
  } = props || {};
  const { state } = useStore();
  const permissionButton = state?.user?.buttonList || [];
  const newValue = Array.isArray(auth) ? auth : !isNull(auth) ? [auth] : [];
  const some = permissionButton[type]((role) => {
    return newValue.includes(role);
  });
  const item = filterEnum(text, options, null, 'group');
  const dom = isObject(item) ? <a-tag color={item?.color}>{item?.label}</a-tag> : text;

  const Switch = () => {
    return (
      <a-switch
        onChange={(event) => {
          handleStatusChange && handleStatusChange({ event, ...params });
        }}
        checked-children={checkedChildren}
        un-checked-children={unCheckedChildren}
        checked={text === CONST_STRING_0}
        disabled={disabled}
      ></a-switch>
    );
  };

  if (!isPermission) {
    return Switch();
  }

  return !some ? dom : Switch();
};

export default StatusSwitch;
