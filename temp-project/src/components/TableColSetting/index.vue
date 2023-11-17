<template>
  <a-popover v-model:visible="show" title="" trigger="click" placement="bottomRight" style="width: 400px">
    <template #content>
      <a-table
        v-bind="$attrs"
        size="small"
        :columns="columns"
        :dataSource="dataSource"
        :customRow="customRow"
        :pagination="false"
        :rowSelection="rowSelection"
        rowKey="dataIndex"
        :scroll="{ y: 400 }"
      ></a-table>
    </template>
    <slot name="button"></slot>
  </a-popover>
</template>
<script setup>
import { ref, computed, reactive, unref } from 'vue';
import _ from 'lodash';
import DB from '@/utils/db';
import { useRouter } from 'vue-router';
import { isNull } from '@/utils/utils';
const { currentRoute } = useRouter();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  colData: {
    type: Array,
    default: []
  },
  callback: {
    type: Function,
    default: null
  },
  tableName: {
    type: String,
    default: ''
  }
});

const dataSource = ref(props.colData);
const show = ref(props.visible);
const columns = [
  {
    title: '列表字段选择',
    dataIndex: 'title'
  }
];

// 选择
// 禁止选择的
const disabledKeys = props.colData.reduce((result, current) => {
  current.disabled && result.push(current.dataIndex);
  return result;
}, []);

// 默认传入的都展示
const allSelectedRowKeys = props.colData.reduce((result, current) => {
  if (isNull(current.show) || current.show) {
    result.push(current.dataIndex);
  }
  return result;
}, []);

// 没有传入tableName使用当前路由的name值
const tableName = props.tableName || unref(currentRoute).name;
// 缓存当前表格的列设置
const storageKey = `${tableName}-table-columns`;
const storageRowKeys = DB.getLocal(storageKey);
const defaultSelectedRowKeys = storageRowKeys && DB.getLocal(storageKey).length !== 0 ? storageRowKeys : allSelectedRowKeys;
const selectedRowKeys = ref([...defaultSelectedRowKeys]);

const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.disabled
    }),
    onChange: (changableRowKeys) => {
      selectedRowKeys.value = _.uniq(changableRowKeys.concat(disabledKeys));
      handleChange && handleChange();
    }
  };
});

const handleChange = () => {
  const result = _.intersectionWith(unref(dataSource), unref(selectedRowKeys), (item1, item2) => item1?.dataIndex === item2);
  DB.setLocal(storageKey, unref(selectedRowKeys));
  props.callback && props.callback(result);
};
handleChange && handleChange();

// 拖拽排序
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
      const data = _.cloneDeep(unref(dataSource));
      const temp = data[change1];
      dataSource.value[change1] = dataSource.value[change2];
      dataSource.value[change2] = temp;
      handleChange && handleChange();
    }
  };
};
</script>

<style lang="less" scope>
.ant-popover {
  width: 200px;
}
</style>
