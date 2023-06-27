import { reactive, toRefs } from 'vue';

export const useTable = (options) => {
  const { searchParam, requestApi, firstRequestAuto = true } = options || {};
  const state = reactive({
    // 表格数据
    tableData: [],
    // 分页数据
    page: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 100
    },
    colData: []
  });

  //   获取表格数据
  const getTableData = async () => {
    try {
      // TODO:
      console.log('{ ...searchParam, ...state.page }', { ...searchParam.value, ...state.page });
      //   const data = await (api && requestApi({ ...searchParam, ...state.page }));
      //   console.log('data', data);
      state.tableData = [];
      state.page = { ...state.page, total: 200 };
    } catch (error) {
      console.log('表格数据获取失败：', error);
    }
  };

  //   页码变化的回调
  const handleSizeChange = (current, size) => {
    state.page = { ...state.page, pageNum: current, pageSize: size };
    getTableData();
  };

  const showTotalText = (total) => {
    return `共 ${total} 条`;
  };

  const init = () => {
    //   首次请求
    firstRequestAuto && getTableData();
    // state.colData = columns.
  };
  init();

  return {
    ...toRefs(state),
    config: {
      hideOnSinglePage: true,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: showTotalText
    },
    handleSizeChange
  };
};
