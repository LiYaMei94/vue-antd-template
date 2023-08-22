<template>
  <div v-if="formConfig.length" class="card table-search">
    <a-form :model="searchParam" ref="formRef">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchFormCol">
        <GridItem v-for="(item, index) in formConfig" :key="item.value" v-bind="getResponsive(item)" :index="index">
          <a-form-item :label="`${item.label} :`" :name="item.value" :labelCol="labelCol">
            <SearchFormItem :column="item" v-model:searchParam="searchParam" />
          </a-form-item>
        </GridItem>
        <GridItem suffix>
          <div class="operation">
            <a-button v-if="showCollapse" type="link" @click="collapsed = !collapsed">
              <component :is="collapsed ? 'DownOutlined' : 'UpOutlined'"></component>
              {{ collapsed ? '展开' : '合并' }}
            </a-button>
            <a-button class="margin-left-12" type="primary" @click="handleSearch">搜索</a-button>
            <a-button @click="handleReset" class="margin-left-12">重置</a-button>
          </div>
        </GridItem>
      </Grid>
    </a-form>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import SearchFormItem from './components/SearchFormItem.vue';
import Grid from '@/components/Grid/index.vue';
import GridItem from '@/components/Grid/GridItem.vue';

// 默认值
const props = defineProps({
  formConfig: {
    type: [Array, null],
    default: []
  },
  searchFormCol: {
    type: [Number, Object],
    default: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  },
  search: {
    type: Function,
    default: null
  },
  reset: {
    type: Function,
    default: null
  },
  labelCol: {
    type: Object,
    default: { span: 5 }
  },
  formatSearchParams: {
    // 更新参数格式
    type: Function,
    default: null
  },
  defaultSearchParams: {
    // 默认参数
    type: Object,
    default: {}
  }
});

// 获取响应式设置
const getResponsive = (item) => {
  const col = item?.col || {};
  return {
    span: col.span,
    offset: col.offset || 0,
    xs: col.xs,
    sm: col.sm,
    md: col.md,
    lg: col.lg,
    xl: col.xl
  };
};

const searchParam = ref();
watch(
  () => props.defaultSearchParams,
  (val) => {
    searchParam.value = { ...searchParam.value, ...val };
  },
  { deep: true, immediate: true }
);

const formRef = ref(null);
// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  if (props.formConfig.length) {
    props.formConfig.reduce((prev, current) => {
      const col = current?.col || {};
      prev += (col[breakPoint.value]?.span || col.span || 1) + (col[breakPoint.value]?.offset || col.offset || 0);
      if (typeof props?.searchFormCol !== 'number') {
        if (prev > props?.searchFormCol[breakPoint.value]) {
          show = true;
        }
      } else {
        if (prev >= props?.searchFormCol) {
          show = true;
        }
      }
      return prev;
    }, 0);
  }

  return show;
});

// 查询
const handleSearch = () => {
  const params = (props.formatSearchParams && props.formatSearchParams(searchParam.value)) || searchParam.value;
  props.search && props.search(params);
};

// 重置
const handleReset = () => {
  formRef.value.resetFields();
  props.reset && props.reset(props.defaultSearchParams);
};
</script>

<style lang="less" scoped>
.table-search {
  border-bottom: 1px solid var(--ant-line-color);
  .operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 18px;
  }
}
</style>
