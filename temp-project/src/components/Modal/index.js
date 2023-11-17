import IconSvg from '../Icon/IconSvg';
import { Modal } from 'ant-design-vue';

const ConfirmPlugin = (props) => {
  Modal.confirm({
    ...props,
    wrapClassName: props.wrapClassName || 'custom-modal',
    icon: (
      <IconSvg
        name='warning'
        style='width:20px;height:20px;fill:var(--private-warning-color);margin-right: 8px;'
        class='anticon anticon-exclamation-circle'
      ></IconSvg>
    )
  });
};

const InfoPlugin = (props) => {
  Modal.info({
    ...props,
    wrapClassName: props.wrapClassName || 'custom-modal',
    icon: (
      <IconSvg
        name='warning'
        style='width:20px;height:20px;fill:var(--private-warning-color);margin-right: 8px;'
        class='anticon anticon-exclamation-circle'
      ></IconSvg>
    ),
    okText: props.okText || '我知道了'
  });
};

const DeletePlugin = (props) => {
  Modal.confirm({
    ...props,
    wrapClassName: props.wrapClassName || 'custom-modal',
    icon: (
      <IconSvg
        name='warning'
        style='width:20px;height:20px;fill:var(--private-warning-color);margin-right: 8px;'
        class='anticon anticon-exclamation-circle'
      ></IconSvg>
    ),
    okText: props.okText || '取消',
    cancelText: props.cancelText || '删除',
    cancelButtonProps: props.cancelButtonProps || { danger: true, type: 'primary' },
    okButtonProps: props.okButtonProps || { type: 'default' },
    autoFocusButton: null
  });
};

const successPlugin = (props) => {
  Modal.success({ ...props });
};

const errorPlugin = (props) => {
  Modal.error({ ...props });
};

const warningPlugin = (props) => {
  Modal.warning({ ...props });
};

export default { confirm: ConfirmPlugin, info: InfoPlugin, delete: DeletePlugin, warning: warningPlugin, error: errorPlugin, success: successPlugin };
