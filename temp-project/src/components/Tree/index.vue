<template>
  <div class="custom-tree-container">
    <div class="search-wrap" v-if="isSearch">
      <a-input v-model:value="searchValue" style="margin-bottom: 10px" placeholder="搜索" allowClear @pressEnter="handleSearch" @blur="handleSearch">
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>
    <div class="title-wrap">
      <span class="text-ellipsis" v-if="treeName">{{ treeName }}</span>
      <div class="action-wrap">
        <slot name="headerAction"></slot>
        <a-button type="link" v-if="isEdit" @click="handleAddParent">
          <template #icon><PlusOutlined /></template>
          添加
        </a-button>
      </div>
    </div>
    <div class="content">
      <a-tree
        v-bind="$attrs"
        v-model:selectedKeys="selectedKeys"
        v-model:expanded-keys="expandedKeys"
        :tree-data="treeList"
        :auto-expand-parent="autoExpandParent"
        :key="treeList.length"
        :fieldNames="fieldNames"
        :load-data="onLoadData"
      >
        <template #title="treeNodeData">
          <div class="tree-content">
            <template v-if="treeNodeData.edit || treeNodeData.add">
              <div class="editable-cell-input-wrapper">
                <a-input
                  v-model:value="ediTreeData[treeNodeData[key]][title]"
                  :class="{
                    'tree-edit-input': true,
                    'input-status-error': isNull(ediTreeData[treeNodeData[key]][title]) && !treeNodeData.add
                  }"
                  @pressEnter="handleSave({ [key]: treeNodeData[key] })"
                  style="width: 300px"
                  placeholder="请输入组织名称"
                  :maxlength="20"
                  allowClear
                  showCount
                />
                <a-button type="link" @click.stop="handleSave({ [key]: treeNodeData[key] })">
                  <check-outlined class="editable-cell-icon-check" />
                </a-button>
                <a-popconfirm title="确定取消当前操作吗?" ok-text="是" cancel-text="否" @confirm.stop="handleCancel({ [key]: treeNodeData[key] })">
                  <a-button type="link" danger>
                    <close-outlined style="fill: var(--ant-error-color)" class="editable-cell-icon-check" />
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
            <template v-else>
              <div class="tree-title text-ellipsis" :title="treeNodeData[title]">
                <span v-if="treeNodeData[title]?.indexOf(searchValue) > -1">
                  {{ treeNodeData[title]?.substr(0, treeNodeData[title]?.indexOf(searchValue)) }}
                  <span style="color: var(--ant-primary-color); background-color: var(--private-primary-color-1)">{{ searchValue }}</span>
                  {{ treeNodeData[title]?.substr(treeNodeData[title]?.indexOf(searchValue) + searchValue.length) }}
                </span>
                <span v-else>{{ treeNodeData[title] }}</span>
              </div>
              <div class="tree-content-action" v-if="treeNodeActionSlot">
                <div class="tree-content-action-wrap"><slot name="treeNodeAction"></slot></div>
              </div>
            </template>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, useSlots, reactive, computed, onUnmounted, watchEffect } from 'vue';
import { isNull, changeTreePositionData, getParentKeys, treeToArr, getExpandedTreeByNumber } from '@/utils/utils';
import _ from 'lodash';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL } from '@/utils/const';

const props = defineProps({
  isSearch: {
    type: Boolean,
    default: true
  },
  initRequest: {
    type: Boolean,
    default: null
  },
  treeName: {
    type: String,
    default: null
  },
  isLazyLoad: {
    type: Boolean, //true: 懒加载，isSearch=true后端搜索;false: 不加载，isSearch=true前端搜索
    default: false
  },
  treeData: {
    type: Array,
    default: null
  },
  getTreeData: {
    type: Function,
    default: null
  },
  fieldNames: {
    type: Object,
    default: { title: 'title', key: 'key', children: 'children' }
  },
  defaultSelectedKeys: {
    type: Array,
    default: []
  },
  defaultExpandedKeys: {
    type: Array,
    default: []
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  onSave: {
    type: Function,
    default: null
  }
});

const treeNodeActionSlot = useSlots()?.treeNodeAction;
const searchValue = ref('');
const expandedKeys = ref([]);
const selectedKeys = ref([]);
const selectedNodes = ref([]);
const autoExpandParent = ref(false);
const treeList = ref([]);
const ediTreeData = reactive({});
const key = computed(() => props.fieldNames?.key || 'key');
const title = computed(() => props.fieldNames?.title || 'title');
let dataList = ref([]);

// 前端搜索数据
watch(
  treeList,
  (val) => {
    dataList.value = treeToArr(_.cloneDeep(val));
  },
  {
    deep: true
  }
);

if (props.isSearch) {
  watch(searchValue, (newVal, oldVal) => {
    if (props.isSearch && !_.isEqual(newVal, oldVal)) {
      handleSearch();
    }
  });
}

watch(
  () => props.defaultSelectedKeys,
  (newSelect, oldSelect) => {
    if (!_.isEqual(newSelect, oldSelect) && !isNull(newSelect)) {
      selectedKeys.value = newSelect;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.defaultExpandedKeys,
  (newExpand, oldExpand) => {
    if (!_.isEqual(newExpand, oldExpand) && !isNull(newExpand)) {
      expandedKeys.value = newExpand;
    }
  },
  { deep: true, immediate: true }
);

watchEffect(() => {
  const nodeKey = key.value;
  const data = _.intersectionWith(dataList.value, selectedKeys.value, (item1, item2) => {
    return item1[nodeKey] === item2;
  });
  selectedNodes.value = data || [];
});

watchEffect(async () => {
  if (props.initRequest) {
    const result = props.getTreeData && (await props.getTreeData());
    treeList.value = result || [];
  }
});

const onLoadData = (treeNode) => {
  return new Promise(async (resolve) => {
    if (treeNode?.dataRef?.children?.length) {
      resolve();
      return;
    }
    const nodeKey = key.value;
    treeNode.dataRef.children = props.getTreeData && (await props.getTreeData({ parentId: treeNode[nodeKey] }));
    treeList.value = [...treeList.value];
    let expanded = [];
    if (treeNode.parentId === '0' && treeNode.level === 1) {
      // FIXME:有选中的不能互斥关闭
      const selectedKey = selectedKeys.value.length ? selectedKeys.value[0] : null;
      if (!isNull(selectedKey)) {
        expanded = dataList.value
          .map((item) => {
            if (item[nodeKey] === selectedKey) {
              return getParentKeys(item[nodeKey], treeList.value, nodeKey);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
      }
      expandedKeys.value = !isNull(treeNode[nodeKey]) ? [...expanded, treeNode[nodeKey]] : [];
    }
    resolve();
  });
};

// 前端匹配搜索
const handleMath = () => {
  const nodeKey = key.value;
  const label = title.value;
  const expanded = dataList.value
    .map((item) => {
      if (item[label]?.indexOf(searchValue.value) > -1) {
        return getParentKeys(item[nodeKey], treeList.value, nodeKey);
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  expandedKeys.value = expanded;
  autoExpandParent.value = true;
};

// 查询
const handleSearch = async () => {
  if (!props.isLazyLoad) {
    handleMath();
  } else {
    props.getTreeData && (await props.getTreeData({ keywords: searchValue.value }));
    selectedKeys.value = [];
    expandedKeys.value = [];
  }
};

// 编辑树
const handleSave = (params) => {
  props.onSave && props.onSave(params);
  delete ediTreeData[params[key.value]];
};

const handleCancel = () => {};

// 添加顶级
const handleAddParent = async ({}) => {
  const count = treeList.value.length;
  const nodeKey = key.value;
  const label = title.value;
  const newData = {
    [label]: ``,
    add: true,
    [nodeKey]: `${count}-private`,
    sort: 0
  };
  ediTreeData[newData[nodeKey]] = { ...newData };
  treeList.value.unshift(newData);
};

defineExpose({ expandedKeys, autoExpandParent, selectedKeys, treeData: treeList, selectedNodes });
</script>
<style lang="less" scoped></style>
