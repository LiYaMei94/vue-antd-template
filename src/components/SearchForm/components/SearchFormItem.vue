<template>
  <component
    :is="column?.render || `a-${column?.el}`"
    v-bind="{ ...handleSearchProps, ...placeholder, allowClear }"
    v-model:value.trim="searchParam[column.value]"
  ></component>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { isArray, isNull } from '@/utils/utils';

const props = defineProps({
  column: {
    type: Object,
    default: {}
  },
  searchParam: {
    type: Object,
    default: {}
  }
});

// 属性透传
const handleSearchProps = computed(() => {
  let searchProps = props.column?.props || {};
  return searchProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const attr = props.column.props;
  const type = ['datetimerange', 'daterange', 'monthrange'];
  if (type.includes(attr?.type) || attr?.isRange) {
    return { rangeSeparator: '至', startPlaceholder: '开始时间', endPlaceholder: '结束时间' };
  }
  const placeholder = attr?.placeholder || (props.column?.el?.includes('input') ? '请输入' : '请选择');
  return { placeholder };
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const allowClear = computed(() => {
  const attr = props.column.props;
  return attr?.allowClear || isNull(attr?.defaultValue);
});
</script>
