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
        <MyIcon type='icon-question-circle'></MyIcon>
      </a-tooltip>
    </>
  );
};

export default QuestionTooltip;
