<template>
  <a-table :columns="columns" :dataSource="newDataSource" bordered :pagination="false" :rowKey="rowKey" :customRow="tableRowClick">
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="editColumns.includes(column?.dataIndex)">
        <div>
          <component
            v-if="!isNull(record[key])"
            :is="column?.render || (column?.el && `a-${column?.el}`) || `a-input`"
            placeholder="输入内容"
            @change="handleRowChange($event, column?.dataIndex, record)"
            :value="text"
            v-bind="{ ...column.props }"
          ></component>
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template v-else-if="column?.dataIndex === 'action'">
        <slot name="actionOther" :dataInfo="{ column, text, record, index }"></slot>
      </template>
      <slot name="bodyCell" :dataInfo="{ column, text, record, index }"></slot>
    </template>
    <template #headerCell="{ column, text, record, index }">
      <slot name="headerCell" :dataInfo="{ column, text, record, index }"></slot>
    </template>
  </a-table>
  <div class="table-pagination" v-if="pagination.total > 1">
    <a-pagination v-bind="{ ...pagination }" :total="pagination.total" @change="handleChange" />
  </div>
  <div class="table-add" v-if="tableAddRow">
    <a-button type="link" @click="handleAdd">+ 添加行</a-button>
    <slot name="tableAdd"></slot>
  </div>
</template>
<script setup>
import { computed, ref, reactive, watch } from 'vue';
import _ from 'lodash';
import { isNull } from '@/utils/utils';

const props = defineProps({
  pagination: {
    type: Object,
    default: {}
  },
  dataSource: {
    type: [Array, Object],
    default: []
  },
  columns: {
    type: Array,
    default: []
  },
  editColumns: {
    type: Array,
    default: []
  },
  handleSizeChange: {
    type: Function,
    default: null
  },
  rowKey: {
    type: [String, Function],
    default: null
  },
  tableRowClick: {
    type: Function,
    default: null
  },
  tableAddRow: {
    type: Boolean,
    default: true
  },
  key: {
    type: [String, Number],
    default: 'myKey'
  }
});

const key = props.key;
// 表格设置指定key，展示可编辑
const setTableDataKey = (value) => {
  return _.map(value, (item, index) => {
    return { ...item, [key]: index };
  });
};

const dataIndexArr = _.map(props.columns, 'dataIndex');
const newDataSource = ref([...setTableDataKey(props.dataSource)]);
const count = computed(() => newDataSource.value.length);
watch(
  () => props.dataSource,
  (val) => {
    newDataSource.value = setTableDataKey(val);
  }
);

const handleAdd = () => {
  let newData = { [key]: count.value };
  dataIndexArr.forEach((element) => {
    if (element === 'action') return;
    if (element.includes(props.editColumns) !== -1) {
      newData[element] = ``;
    } else {
      newData[element] = '';
    }
  });
  newDataSource.value.push(newData);
};

const handleRowChange = (event, dataIndex, record) => {
  const type = event?.type;
  const value = type === 'input' ? event?.target?.value : event;
  const obj = newDataSource.value.filter((item) => record[key] === item[key])[0];
  Object.assign(obj, { ...obj, [dataIndex]: value });
};

defineExpose({ dataSource: newDataSource });
</script>
<style lang="less" scoped>
.table-add {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  border: 1px solid var(--ant-line-color);
}
</style>
