<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, useSlots, computed, provide, onBeforeMount, onMounted, onUnmounted } from 'vue';
import { isObject, isNull, isArray } from '@/utils/utils';

const props = defineProps({
  cols: {
    type: Object,
    default: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  collapsedRows: {
    type: Number,
    default: 1
  },
  gap: {
    type: [Number, Array],
    default: 0
  }
});

onBeforeMount(() => props.collapsed && findIndex());
onMounted(() => {
  resize({ target: { innerWidth: window.innerWidth } });
  window.addEventListener('resize', resize);
});
onUnmounted(() => {
  window.removeEventListener('resize', resize);
});

// 监听屏幕变化
const resize = (e) => {
  let width = e.target.innerWidth;
  switch (!!width) {
    // case width < 768:
    //   breakPoint.value = 'xs';
    //   break;
    case width >= 768 && width < 992:
      breakPoint.value = 'sm';
      break;
    case width >= 992 && width < 1200:
      breakPoint.value = 'md';
      break;
    case width >= 1200 && width < 1920:
      breakPoint.value = 'lg';
      break;
    case width >= 1920:
      breakPoint.value = 'xl';
      break;
    default:
      breakPoint.value = 'md';
      break;
  }
};

let breakPoint = ref('xl');
const hiddenIndex = ref(-1);
const gridCols = computed(() => {
  if (isObject(props.cols)) {
    return props.cols[breakPoint.value] || props.cols;
  }
  return props.cols;
});

// 注入 gap 间距
provide('gap', isArray(props.gap) ? props.gap[0] : props.gap);
// 注入响应式断点
provide('breakPoint', breakPoint);
// 注入要开始折叠的 index
provide('shouldHiddenIndex', hiddenIndex);
// 注入 cols
provide('cols', gridCols);

// 寻找需要开始折叠的字段 index
const slots = useSlots().default();

const findIndex = () => {
  let fields = [];
  let suffix = null;
  slots.forEach((slot) => {
    // suffix
    if (isObject(slot.type) && slot.type.name === 'GridItem' && isNull(slot.props?.suffix)) suffix = slot;
    // slot children
    if (typeof slot.type === 'symbol' && isArray(slot.children)) fields.push(...slot.children);
  });

  // 计算 suffix 所占用的列
  let suffixCols = 0;
  if (suffix) {
    suffixCols =
      (suffix.props[breakPoint.value]?.span || suffix.props?.span || 1) + (suffix.props[breakPoint.value]?.offset || suffix.props?.offset || 0);
  }
  try {
    let find = false;
    fields.reduce((prev = 0, current, index) => {
      prev +=
        (current.props[breakPoint.value]?.span || current.props?.span || 1) + (current.props[breakPoint.value]?.offset || current.props?.offset || 0);
      if (Number(prev) > props.collapsedRows * gridCols.value - suffixCols) {
        hiddenIndex.value = index;
        find = true;
        throw 'find it';
      }
      return prev;
    }, 0);
    if (!find) hiddenIndex.value = -1;
  } catch (e) {
    // console.warn(e);
  }
};

// 断点变化时 执行 findIndex
watch(
  () => breakPoint.value,
  () => {
    if (props.collapsed) findIndex();
  }
);

// 监听 collapsed
watch(
  () => props.collapsed,
  (value) => {
    if (value) return findIndex();
    hiddenIndex.value = -1;
  }
);

// 设置间距
const gridGap = computed(() => {
  if (typeof props.gap === 'number') return `${props.gap}px`;
  if (isArray(props.gap)) return `${props.gap[1]}px ${props.gap[0]}px`;
  return 'unset';
});

// 设置 style
const style = computed(() => {
  return {
    display: 'grid',
    gridGap: gridGap.value, // gridColumn属性是grid-column-start和grid-column-end的合并简写形式
    gridTemplateColumns: `repeat(${gridCols.value}, minmax(0, 1fr))` // 每一列的列宽，rf片段
  };
});

// 暴露给上层组件的方法
defineExpose({ breakPoint });
</script>
