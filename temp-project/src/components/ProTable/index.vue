<template>
  <SearchForm v-bind="{ formConfig, defaultSearchParams, labelCol, searchFormCol, search, reset }"></SearchForm>
  <div class="pro-table">
    <div class="pro-table-header">
      <div class="pro-table-header-left">
        <slot name="tableHeaderLeft"></slot>
      </div>
      <div class="pro-table-header-right" v-if="showToolButton">
        <slot name="toolButton"></slot>
        <!-- 刷新表格 -->
        <div v-if="refreshTableButton" @click="handleSearch" class="margin-left-16 pro-table-right-tool-btn">
          <IconSvg name="table-refresh" style="width: 16px; height: 16px"></IconSvg>
        </div>
        <!-- 设置表格展示列 -->
        <TableColSetting v-if="showColSettingButton" v-bind="{ visible, colData: columns, callback: updateColumns, tableName }">
          <template #button>
            <div class="margin-left-16 pro-table-right-tool-btn" v-if="customColumnsButton" @click="visible = !visible">
              <IconSvg name="table-setting" style="width: 16px; height: 16px"></IconSvg>
            </div>
          </template>
        </TableColSetting>
      </div>
    </div>
    <a-table
      v-bind="$attrs"
      :customRow="rowDrag ? customRow : null"
      :dataSource="tableData"
      :columns="newColumns"
      :expandIcon="expandIcon"
      :rowKey="rowKey"
      :pagination="pagination && { ...config, ...page }"
      :expandedRowKeys="expandedRowKeys"
      :loading="loading"
      :size="state.global?.antConfig?.size || 'small'"
      @expand="onTableExpand"
      @change="handleChange"
      :scroll="{ x: scroll?.x, y: scrollY }"
      id="pro-table"
    >
      <template #bodyCell="{ column, text, record, index }">
        <slot name="bodyCell" :dataInfo="{ column, text, record, index }"></slot>
      </template>
      <template #headerCell="{ column, text, record }">
        <slot name="headerCell" :dataInfo="{ column, text, record }"></slot>
      </template>
    </a-table>
    <!-- <div class="table-pagination pro-table-pagination">
      <a-pagination v-if="page.total > 0" v-bind="{ ...config, ...page }" :total="page.total" @change="handleSizeChange" />
    </div> -->
  </div>
</template>
<script setup lang="jsx">
import SearchForm from '@/components/SearchForm';
import TableColSetting from '@/components/TableColSetting';
import { useTable } from '@/hooks/useTable';
import { ref, unref, h, watch, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { isNull } from '@/utils/utils';
import { headerHeightNumber } from '@/assets/style/variables.module.less';

const props = defineProps({
  tableName: {
    type: String,
    default: ''
  },
  formConfig: {
    type: Array,
    default: []
  },
  formatSearchParams: {
    // 更新参数格式
    type: Function,
    default: null
  },
  labelCol: {
    type: Object,
    default: { span: 5 }
  },
  searchFormCol: {
    type: [Number, Object],
    default: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  },
  defaultSearchParams: {
    // 默认查询参数
    type: Object,
    default: {}
  },
  requestApi: {
    type: Function,
    default: null
  },
  columns: {
    type: Array,
    default: []
  },
  refreshTableButton: {
    type: Boolean,
    default: true
  },
  showToolButton: {
    type: Boolean,
    default: true
  },
  showColSettingButton: {
    type: Boolean,
    default: true
  },
  customColumnsButton: {
    type: Boolean,
    default: true
  },
  expandedRowKeys: {
    type: Array,
    default: []
  },
  rowKey: {
    type: [String, Function],
    default: (record, index) => index
  },
  rowDrag: {
    // 行拖拽排序
    type: Boolean,
    default: false
  },
  dragChange: {
    type: Function,
    default: null
  },
  expandIcon: {
    type: Object,
    default: { expanded: 'DownOutlined', collapsed: 'RightOutlined' }
  },
  firstRequestAuto: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Boolean,
    default: true
  },
  onChange: {
    type: Function,
    default: null
  },
  scroll: {
    type: Object,
    default: { x: 1000 }
  },
  isComputeScrollY: {
    type: Boolean,
    default: true
  }
});

const scrollY = ref();
const searchParam = ref({});
const expandedRowKeys = ref();
watch(
  () => props.defaultSearchParams,
  (val) => {
    searchParam.value = { ...searchParam.value, ...val };
  },
  { deep: true, immediate: true }
);
watch(
  () => props?.expandedRowKeys,
  (val) => {
    expandedRowKeys.value = [...val];
  },
  { deep: true, immediate: true }
);

const { state } = useStore();
const visible = ref(false);
const newColumns = ref(props.columns);
const { config, handleSizeChange, tableData, page, getTableData, loading } =
  useTable({
    searchParam,
    requestApi: props.requestApi,
    firstRequestAuto: props.firstRequestAuto,
    formatSearchParams: props.formatSearchParams
  }) || {};

onMounted(() => {
  // FIXME:修改页码跳转组件的文案
  const quickJumper = document.getElementsByClassName('ant-pagination-options-quick-jumper');
  if (!isNull(quickJumper) && !isNull(quickJumper[0])) {
    quickJumper[0].childNodes[0].nodeValue = '前往';
  }

  // 计算滑动
  if (props.isComputeScrollY) {
    resize({ target: { innerWidth: window.innerWidth, innerHeight: window.innerHeight } });
    window.addEventListener('resize', resize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});

const resize = (e) => {
  let width = e.target.innerWidth;
  const height = e.target.innerHeight;
  const proTableDom = document.getElementById('pro-table');
  const offset = proTableDom.getBoundingClientRect();
  const proTableHeaderHeight = 39;
  let paginationHeight = 0;
  if (width < 1920) {
    paginationHeight = 24 + 16;
  }
  scrollY.value = height - offset.top - headerHeightNumber - proTableHeaderHeight - paginationHeight;
};

const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
  handleSizeChange && handleSizeChange(pagination);
  props.onChange && props.onChange(pagination, filters, sorter, { currentDataSource });
};

// 更新表格columns
const updateColumns = (cols) => {
  newColumns.value = cols;
};

// 查询
const search = (params) => {
  searchParam.value = { ...searchParam.value, ...params };
  getTableData && getTableData();
};

// 刷新表格
const handleSearch = () => {
  getTableData && getTableData();
};

// 重置
const reset = (params) => {
  searchParam.value = { ...props.defaultSearchParams };
  getTableData && getTableData();
};

// 更新行数据
const updateRowData = (record, index) => {
  tableData.value.splice(index, 1, record);
};

// 表格拖拽排序
let change1 = null; // 源目标数据序号
let change2 = null; // 目标数据序号
const customRow = (record, index) => {
  return {
    style: {
      cursor: 'pointer'
    },
    // 鼠标移入
    onMouseenter: (event) => {
      // 兼容IE
      var ev = event || window.event;
      ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
    },
    // 开始拖拽
    onDragstart: (event) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到源目标数据序号
      change1 = index;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      // 兼容 IE
      var ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: (event) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到目标数据序号
      change2 = index;
      // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
      const data = _.cloneDeep(unref(tableData));
      const temp = data[change1];
      tableData.value[change1] = tableData.value[change2];
      tableData.value[change2] = temp;
      props.dragChange && props.dragChange({ ...tableData.value[change1], change1 }, { ...tableData.value[change2], change2 });
    }
  };
};

// 自定义展开图标
const expandIcon = (options) => {
  let icon = props.expandIcon?.expanded;
  if (!options.expanded) {
    icon = props.expandIcon?.collapsed;
  }
  return options.record?.children?.length ? (
    <IconFont
      source='anticonfont'
      type={icon}
      onClick={(e) => options.onExpand(options.record, e)}
      class='custom-ant-table-row-expand-icon'
    ></IconFont>
  ) : (
    <span class='anticon anticon-down custom-ant-table-row-expand-icon'></span>
  );
};

// 点击展开行
const onTableExpand = (expanded, record) => {
  if (expanded) {
    expandedRowKeys.value.push(record[props.rowKey]);
  } else {
    expandedRowKeys.value.splice(expandedRowKeys.value.indexOf(record[props.rowKey]), 1);
  }
};

// 暴露给上层组件的方法
defineExpose({ getTableData, updateRowData, tableData });
</script>

<style lang="less">
.pro-table {
  .pro-table-header {
    width: 100%;
    padding: 16px 0px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .pro-table-header-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;
      .table-name {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .pro-table-header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .custom-ant-table-row-expand-icon {
    cursor: pointer;
    color: #666;
    font-size: 12px;
    width: 20px;
  }
  .pro-table-right-tool-btn {
    width: 32px;
    height: 32px;
    border-radius: 2px;
    background: var(--private-bg-2);
    color: var(--private-first-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    svg {
      fill: var(--private-first-text-color);
    }
  }
  .pro-table-right-tool-btn:focus,
  .pro-table-right-tool-btn:hover {
    background: var(--private-primary-color-1);
    svg {
      fill: var(--ant-primary-color);
    }
  }

  // .pro-table-pagination {
  //   position: fixed;
  //   bottom: 0;
  //   right: @contentMarginRight;
  //   z-index: 2;
  //   width: calc(100% - @siderWidth - @contentMarginLeft - @contentMarginRight);
  //   box-shadow: 0px -2px 5px -2px var(--private-header-shadow);
  // }
}
</style>
