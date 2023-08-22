import { Modal } from 'ant-design-vue';

const DeleteButton = (props, context) => {
  const { text = '删除', isModal = true, deleteFun, modalOptions } = props || {};
  const { title = '删除提示', content = '确定要删除吗？' } = modalOptions || {};

  // 删除
  const handleDelete = () => {
    Modal.confirm({
      title,
      content,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteFun && deleteFun();
      }
    });
  };

  return isModal ? (
    <a class='table-custom-danger' onClick={handleDelete}>
      {text}
    </a>
  ) : (
    <a-popconfirm title={content} onConfirm={deleteFun}>
      <a class='table-custom-danger'>{text}</a>
    </a-popconfirm>
  );
};

export default DeleteButton;
