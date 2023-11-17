/**
 * 新增按钮
 * @param {*} param0
 * @param {*} context
 * @returns
 */
const AddButton = ({ title = '新增', type = 'primary', onClick = null, ...other }, context) => {
  return (
    <a-button {...other} type={type} onClick={onClick}>
      <div style='display:flex;align-items: center;'>
        <IconSvg name='add-circle' style='width: 16px; height: 16px; margin-right: 5px'></IconSvg>
        {context.slots?.default ? context.slots?.default() : title}
      </div>
    </a-button>
  );
};

export default AddButton;
