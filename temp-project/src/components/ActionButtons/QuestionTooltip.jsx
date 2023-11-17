const QuestionTooltip = (props, context) => {
  const { title = '', label = '', ...other } = props || {};
  return (
    <>
      {label}
      <a-tooltip
        {...other}
        v-slots={{
          title: () => title
        }}
      >
        <IconFont type='icon-question-circle'></IconFont>
      </a-tooltip>
    </>
  );
};

export default QuestionTooltip;
