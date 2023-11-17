import Modal from '@/components/Modal';
import { isNull } from '@/utils/utils';

/**
 *
 * @param {*} title 删除提示title
 * @param {*} content 删除提示内容
 * @param {*} danger 删除 按钮
 * @param {*} deleteCheckFun 删除之前的检查，返回 true 删除、false 做提示
 * @param {*} deleteRequest 删除网络请求
 * @param {*} context
 * @returns
 */
const DeleteButton = (
  { title = '删除提示', text = '删除', content = '确定要删除吗？', danger = false, deleteCheckFun = null, deleteRequest = null, ...other },
  context
) => {
  // 删除
  const handleDelete = async () => {
    try {
      let type = 'delete';
      let checkInfo = null;

      if (!isNull(deleteCheckFun)) {
        checkInfo = await deleteCheckFun();
      }

      if (!isNull(checkInfo)) {
        type = checkInfo?.delete ? 'delete' : 'info';
        content = checkInfo?.content || content;
      }

      Modal[type]({
        title,
        content,
        onCancel() {
          (isNull(deleteCheckFun) || checkInfo?.delete) && deleteRequest && deleteRequest();
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
