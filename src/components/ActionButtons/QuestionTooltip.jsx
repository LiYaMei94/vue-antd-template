const QuestionTooltip = (props, context) => {
  const { title = '', label = '' } = props || {};
  return (
    <>
      {label}
      <a-tooltip
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
