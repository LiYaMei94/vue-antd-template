<template>
  <SearchForm v-bind="{ formConfig, formatSearchParams, initSearchParams, labelCol }" :search="search" :reset="reset"></SearchForm>
  <div class="pro-table">
    <div class="pro-table-header">
      <div class="pro-table-header-left">
        <slot name="tableHeaderLeft"></slot>
      </div>
      <div class="pro-table-header-right" v-if="showToolButton">
        <slot name="toolButton">
          <a-button v-if="refreshTableButton" shape="circle" @click="handleSearch">
            <template #icon><SyncOutlined /></template>
          </a-button>
          <TableColSetting v-bind="{ visible, colData: columns, callback: updateColumns, tableName }">
            <template #button>
              <a-button class="margin-left-12" v-if="customColumnsButton" shape="circle" @click="visible = !visible">
                <template #icon><SettingOutlined /></template>
              </a-button>
            </template>
          </TableColSetting>
        </slot>
      </div>
    </div>
    <a-table size="small" :dataSource="tableData" :columns="newColumns" v-bind="{ ...tableConfig }" :rowKey="rowKey" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <slot name="bodyCell" :dataInfo="{ column, text, record }"></slot>
      </template>
      <template #headerCell="{ column, text, record }">
        <slot name="headerCell" :dataInfo="{ column, text, record }"></slot>
      </template>
    </a-table>
    <div class="table-pagination">
      <a-pagination v-if="page.total > 0" v-bind="{ ...config, ...page }" :total="page.total" @change="handleSizeChange" />
    </div>
  </div>
</template>
<script setup>
import SearchForm from '@/components/SearchForm';
import TableColSetting from '@/components/TableColSetting';
import { useTable } from '@/hooks/useTable';
import { ref } from 'vue';

const searchParam = ref({});
const visible = ref(false);
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
  initSearchParams: {
    type: Object,
    default: null
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
  customColumnsButton: {
    type: Boolean,
    default: true
  },
  tableConfig: {
    type: Object,
    default: {}
  },
  rowKey: {
    type: [String, Function],
    default: (record, index) => index
  }
});

const newColumns = ref(props.columns);
const { config, handleSizeChange, tableData, page, getTableData } = useTable({ searchParam, requestApi: props.requestApi }) || {};

// 更新表格columns
const updateColumns = (cols) => {
  newColumns.value = cols;
};

// 查询
const search = (params) => {
  searchParam.value = { ...props.initSearchParams, ...params };
  console.log('searchParam', searchParam.value, props.initSearchParams, params);
  getTableData && getTableData();
};

// 刷新表格
const handleSearch = () => {
  getTableData && getTableData();
};

// 重置
const reset = (params) => {
  searchParam.value = { ...props.initSearchParams, ...params };
  getTableData && getTableData();
};

// 暴露给上层组件的方法
defineExpose({ search: getTableData });
</script>

<style lang="less" scoped>
.pro-table {
  .pro-table-header {
    width: 100%;
    min-height: 45px;
    display: flex;
    align-items: center;
    .pro-table-header-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;
    }
    .pro-table-header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
