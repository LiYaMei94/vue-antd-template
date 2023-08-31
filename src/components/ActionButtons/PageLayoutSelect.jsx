import { PAGE_LAYOUT, CONST_STRING_1 } from '@/utils/const';
import Style from './style.module.less';

const PageLayoutSelect = (props, context) => {
  const { selectID = CONST_STRING_1, handleClick, disabled = false } = props || {};
  return (
    <div className={Style['page-layout-select']}>
      {PAGE_LAYOUT?.map((item) => {
        return (
          <div
            className={Style['layout-type-item']}
            onClick={() => {
              handleClick && handleClick(item?.value);
            }}
          >
            <div className={Style['layout-type-item-content']}>
              <MyIcon type={item?.icon} style={item.style}></MyIcon>
              {item.value === selectID ? <div className={`${Style['select-bg']} ${!disabled ? Style['selected'] : Style['disabled']}`}></div> : null}
            </div>
            <div className={Style['layout-type-item-label']}>{item?.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PageLayoutSelect;
