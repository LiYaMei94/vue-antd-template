import { useStore } from 'vuex';
import { CONST_STRING_1, CONST_STRING_0, ENABLE_DISABLE_STATUS_ENUM } from '@/utils/const';
import { filterEnum, isObject } from '@/utils/utils';

const isPermission = process.env?.VUE_APP_route_permission === 'true';
const StatusSwitch = (props, context) => {
  const {
    type = 'tag', // switch/tag
    auth = [],
    text,
    handleStatusChange,
    checkedChildren = '启用',
    unCheckedChildren = '停用',
    options = ENABLE_DISABLE_STATUS_ENUM,
    permissionType = 'some',
    params = {},
    disabled,
    unCheckedValue = CONST_STRING_0,
    checkedValue = CONST_STRING_1,
    ...other
  } = props || {};
  const { state } = useStore();
  const isTag = type === 'tag';
  const permissionButton = state?.user?.buttonList || [];
  const newValue = Array.isArray(auth) ? auth : !isNull(auth) ? [auth] : [];
  const some = permissionButton[permissionType]((role) => {
    return newValue.includes(role);
  });
  const item = filterEnum(text, options, null, 'group');
  const dom = isObject(item) ? <a-tag color={item?.color}>{item?.label}</a-tag> : text;

  const Switch = () => {
    return (
      <a-switch
        {...other}
        unCheckedValue={unCheckedValue}
        checkedValue={checkedValue}
        onChange={(event) => {
          handleStatusChange && handleStatusChange({ event, ...params });
        }}
        checked-children={checkedChildren}
        un-checked-children={unCheckedChildren}
        checked={text}
        disabled={disabled}
      ></a-switch>
    );
  };

  if (!isPermission) {
    return Switch();
  }

  return isTag ? dom : !some ? dom : Switch();
};

export default StatusSwitch;
