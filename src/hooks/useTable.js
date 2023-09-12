import { reactive, toRefs, unref } from 'vue';

/**
 *
 * @param {*} searchParam 查询参数
 * @param {*} requestApi api请求
 * @param {*} firstRequestAuto 进入页面是否自动请求
 * @param {*} hideOnSinglePage 只有1页时隐藏页码
 * @param {*} formatSearchParams 重置查询参数或格式
 * @returns
 */
export const useTable = (options) => {
  const {
    searchParam,
    requestApi,
    firstRequestAuto = true,
    hideOnSinglePage = false,
    formatSearchParams,
    customHandle,
    loading = false
  } = options || {};
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
    colData: [],
    loading
  });

  //   获取表格数据
  const getTableData = async (options) => {
    try {
      state.loading = true;
      const { pageSize, current } = state.page || {};
      const params = { ...searchParam.value, pageSize, pageNum: current, ...options };
      const newParams = formatSearchParams ? formatSearchParams(params) : params;
      const data = await (requestApi && requestApi({ ...newParams }));
      const { total, data: result, pageNum, pageSize: size } = data || {};
      customHandle && customHandle(data);
      state.tableData = result || [];
      state.page = { total, current: pageNum, pageSize: size };
      state.loading = false;
      return { total, data: result, pageNum, pageSize: size };
    } catch (error) {
      state.loading = false;
      console.error('hooks-useTable-getTableData', error);
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
      showTotal: showTotalText,
      pageSizeOptions: ['20', '50', '100'] // 默认是['10', '20', '30', '40']
    },
    handleSizeChange,
    getTableData
  };
};
