<template>
  <component
    :is="column?.render || `a-${column?.el}`"
    v-bind="{ ...handleSearchProps, ...placeholder, allowClear, size: state?.global?.antConfig?.componentSize }"
    v-model:value.trim="searchParam[column.value]"
  ></component>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { isNull } from '@/utils/utils';
import { useStore } from 'vuex';

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

const { dispatch, state } = useStore();

// 属性透传
const handleSearchProps = computed(() => {
  const type = props.column.el;
  let searchProps = props.column?.props || {};
  let selectProps = {};
  const selectArr = ['select', 'tree-select', 'TreeSelect'];
  if (selectArr.includes(type)) {
    selectProps = { showSearch: true, optionFilterProp: 'label' };
  }
  return { ...selectProps, ...searchProps };
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const type = props.column.el;
  let placeholder = props.column?.props?.placeholder;
  const rangArr = ['range-picker', 'RangePicker', 'time-range-picker', 'TimeRangePicker'];

  if (rangArr.includes(type)) {
    placeholder = placeholder || ['开始时间', '结束时间'];
  } else if (type?.includes('input')) {
    placeholder = placeholder || '请输入';
  } else {
    placeholder = placeholder || '请选择';
  }
  return { placeholder };
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const allowClear = computed(() => {
  const attr = props.column.props;
  return attr?.allowClear || isNull(attr?.defaultValue);
});
</script>
