import Modal from '@/components/Modal';
import { isNull, isFunction } from '@/utils/utils';

/**
 * FIXME: 400业务错误(info) 500 系统错误(error)
 * @param {*} title 删除提示title
 * @param {*} content 删除提示内容
 * @param {*} danger 删除 按钮
 * @param {*} deleteRequest 删除网络请求
 * @param {*} context
 * @returns
 */
const DeleteButton = ({ title = '删除提示', text = '删除', content = '确定要删除吗？', danger = false, deleteRequest = null, ...other }, context) => {
  // 删除
  const handleDelete = async () => {
    try {
      let type = 'delete';

      Modal[type]({
        title,
        content,
        onCancel() {
          isFunction(deleteRequest) && deleteRequest();
        }
      });
    } catch (error) {
      console.error('ActionButtons-Delete-handleDelete', error);
    }
  };

  return (
    <a-button {...other} type='link' danger={danger} onClick={handleDelete}>
      {context.slots?.icon && context.slots?.icon()}
      {context.slots?.default ? context.slots?.default() : text}
    </a-button>
  );
};

export default DeleteButton;
