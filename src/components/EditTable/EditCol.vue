<template>
  <a-table :columns="newColumns" :data-source="newDataSource" bordered :pagination="false" :rowKey="rowKey">
    <template #bodyCell="{ column, text, record }">
      <template v-if="editColumns.includes(column.dataIndex)">
        <div class="editable-cell">
          <div v-if="editableData[record.key] && editableData.dataIndex === column.dataIndex" class="editable-cell-input-wrapper">
            <a-input
              placeholder="输入内容"
              v-model:value="editableData[record.key][column.dataIndex]"
              @pressEnter="save(record.key, column.dataIndex)"
            />
            <CheckOutlined class="editable-cell-icon-check" @click="save(record.key, column.dataIndex)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <EditOutlined class="editable-cell-icon" @click="edit(record.key, column.dataIndex)" />
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <slot name="action" :dataInfo="{ column, text, record }"></slot>
      </template>
    </template>
  </a-table>
  <div class="table-pagination">
    <a-pagination v-bind="{ ...pagination }" :total="pagination.total" @change="handleChange" />
  </div>
  <div class="table-add">
    <a-button type="link" @click="handleAdd">+ 添加参数</a-button>
  </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue';
import _ from 'lodash';

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
  isAction: {
    type: Boolean,
    default: true
  },
  handleSave: {
    type: Function,
    default: null
  },
  handleSizeChange: {
    type: Function,
    default: null
  },
  rowKey: {
    type: [String, Function],
    default: (record, index) => index
  }
});

const defaultColumns = [
  {
    title: '操作',
    dataIndex: 'action'
  }
];

const newColumns = computed(() => {
  return props.isAction ? props.columns.concat(defaultColumns) : props.columns;
});
const newDataSource = ref([]);
const editableData = reactive({});
const count = computed(() => newDataSource.value.length + 1);

watch(
  () => props.dataSource,
  (val) => {
    newDataSource.value = _.map(val, (item, index) => {
      return { ...item, key: index };
    });
  }
);

const handleAdd = () => {
  const newData = {
    key: count.value,
    name: `xxx`,
    description: `xxx`
  };
  newDataSource.value.push(newData);
};

const edit = (key, dataIndex) => {
  editableData[key] = _.cloneDeep(newDataSource.value.filter((item) => key === item.key)[0]);
  editableData.dataIndex = dataIndex;
};

const save = (key, dataIndex) => {
  const obj = newDataSource.value.filter((item) => key === item.key)[0];
  Object.assign(obj, { ...obj, [dataIndex]: editableData[key][dataIndex] });
  const newEditableData = _.cloneDeep(editableData);
  delete editableData[key];
  delete editableData['dataIndex'];
  props.handleSave && props.handleSave(newEditableData);
};

const handleChange = (current, size) => {
  props?.handleSizeChange && props?.handleSizeChange({ current, size });
};
</script>

<style lang="less" scoped>
.table-add {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  border: 1px solid var(--ant-line);
}
</style>
<style lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: var(--ant-primary-color);
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
