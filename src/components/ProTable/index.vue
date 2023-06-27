<template>
  <SearchForm v-bind="{ formConfig, formatSearchParams, initSearchParams }" :search="search" :reset="reset"></SearchForm>
  <div class="pro-table">
    <div class="pro-table-header">
      <div class="pro-table-header-left">
        <slot name="tableHeaderLeft"></slot>
      </div>
      <div class="pro-table-header-right" v-if="showToolButton">
        <slot name="toolButton">
          <a-button v-if="refreshTableButton" shape="circle" @click="search">
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
    <a-table :dataSource="tableData" :columns="newColumns" v-bind="{ ...tableConfig }"></a-table>
    <div class="pro-table-pagination">
      <a-pagination v-bind="{ ...config }" :total="page.total" @change="handleSizeChange" />
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
    type: Promise,
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
  }
});

const newColumns = ref(props.columns);
const { config, handleSizeChange, tableData, page } = useTable({ searchParam, requestApi: props.requestApi }) || {};

// 更新表格columns
const updateColumns = (cols) => {
  newColumns.value = cols;
};

// 查询
const search = (params) => {
  console.log('params===', params);
  searchParam.value = { ...props.initSearchParams, ...params };
};

// 重置
const reset = (params) => {
  console.log('params===', params);
  searchParam.value = { ...props.initSearchParams, ...params };
};
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
  .pro-table-pagination {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
