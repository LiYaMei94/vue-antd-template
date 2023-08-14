import { reactive, toRefs, unref } from 'vue';

export const useTable = (options) => {
  const { searchParam, requestApi, firstRequestAuto = true, hideOnSinglePage = false, initSearchParams, formatSearchParams } = options || {};
  const state = reactive({
    // 表格数据
    tableData: [],
    // 分页数据
    page: {
      // 当前页数
      current: 1,
      // 每页显示条数
      pageSize: 20,
      // 总条数
      total: 0
    },
    colData: []
  });

  //   获取表格数据
  const getTableData = async (options) => {
    try {
      const { pageSize, current } = state.page || {};
      const params = { ...initSearchParams, ...searchParam.value, pageSize, pageNum: current, ...options };
      const newParams = formatSearchParams ? formatSearchParams(params) : params;
      const data = await (requestApi && requestApi({ ...newParams }));
      const { total, data: result, pageNum, pageSize: size } = data || {};
      state.tableData = result || [];
      state.page = { total, current: pageNum, pageSize: size };
    } catch (error) {
      console.log('表格数据获取失败：', error);
    }
  };

  //   页码变化的回调
  const handleSizeChange = (current, pageSize) => {
    state.page = { ...state.page, current, pageSize };
    getTableData();
  };

  const showTotalText = (total) => {
    return `共 ${total} 条`;
  };

  const init = () => {
    //   首次请求
    firstRequestAuto && getTableData();
  };
  init();

  return {
    ...toRefs(state),
    config: {
      hideOnSinglePage,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: showTotalText
    },
    handleSizeChange,
    getTableData
  };
};
