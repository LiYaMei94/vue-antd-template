import { reactive, toRefs, unref } from 'vue';

export const useTable = (options) => {
  const { searchParam, requestApi, firstRequestAuto = true, hideOnSinglePage = false } = options || {};
  const state = reactive({
    // 表格数据
    tableData: [],
    // 分页数据
    page: {
      // 当前页数
      current: 0,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0
    },
    colData: []
  });

  //   获取表格数据
  const getTableData = async () => {
    try {
      const { pageSize, current } = state.page || {};
      const data = await (requestApi && requestApi({ entity: { ...unref(searchParam) }, pageQuery: { pageSize, pageNum: current } }));
      // const data = { data: [{ name: 'name', description: 'description', id: 1 }], total: 10, pageNum: 1, pageSize: 10 };
      const { total, data: result, pageNum, pageSize: size } = data || {};
      console.log('data', data, result);
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
