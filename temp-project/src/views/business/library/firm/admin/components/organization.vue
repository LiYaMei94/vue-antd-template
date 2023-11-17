<template>
  <div>
    <div class="org-search-wrap">
      <a-input
        v-model:value="searchValue"
        class="tree-search-input"
        style="margin-bottom: 10px"
        placeholder="搜索"
        allowClear
        @pressEnter="handleMath"
        @blur="handleMath"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>
    <div class="org-tree-wrap">
      <a-tree
        v-model:selectedKeys="selectedKeys"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        @expand="onExpand"
        :fieldNames="{ children: 'children', title: 'companyOrgName', key: 'companyOrgId' }"
        :key="treeData.length"
      >
        <template #title="{ companyOrgName }">
          <div class="tree-content">
            <div class="tree-title text-ellipsis" :title="companyOrgName">
              <span v-if="companyOrgName?.indexOf(searchValue) > -1">
                {{ companyOrgName?.substr(0, companyOrgName?.indexOf(searchValue)) }}
                <span style="color: var(--ant-primary-color); background-color: var(--private-primary-color-1)">{{ searchValue }}</span>
                {{ companyOrgName?.substr(companyOrgName?.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ companyOrgName }}</span>
            </div>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script lang="jsx" setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { organizationList } from '@/api/business/companyAdmin';
import { getExpandedTreeByNumber, changeTreePositionData, isNull, isString, getParentKeys } from '@/utils/utils';
import _ from 'lodash';
const props = defineProps({
  companyId: {
    type: [String, Number]
  },
  expandMax: {
    type: Number,
    default: 3
  }
});
const searchValue = ref(null);
const expandedKeys = ref([]);
const treeData = ref([]);
const selectedKeys = ref([]);
const autoExpandParent = ref(false);
let dataList = [];

watch(searchValue, (val) => {
  handleMath();
});

const handleMath = () => {
  const expanded = dataList
    .map((item) => {
      if (item.companyOrgName?.indexOf(searchValue.value) > -1) {
        return getParentKeys(item.companyOrgId, treeData.value, 'companyOrgId');
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  expandedKeys.value = expanded;
  autoExpandParent.value = true;
};

const onExpand = (keys) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};
// 查询
const handleSearch = async () => {
  try {
    const result = await organizationList({ companyId: props.companyId });
    treeData.value = result?.treeData || [];
    selectedKeys.value = selectedKeys?.value?.length
      ? selectedKeys.value
      : !isNull(treeData.value[0]?.companyOrgId)
      ? [treeData.value[0]?.companyOrgId]
      : [];
    const firstTreeNode = treeData.value?.length > 0 ? [treeData.value[0]] : [];
    expandedKeys.value = getExpandedTreeByNumber(firstTreeNode, 'companyOrgId', props.expandMax);
    dataList = result?.data;
  } catch (error) {
    console.error('organization-handleSearch', error);
  }
};
onMounted(async () => {
  await handleSearch();
});
defineExpose({ selectedCompanyOrgId: selectedKeys });
</script>
<style lang="less">
.org-search-wrap {
  .anticon.anticon-search {
    color: var(--private-not-optional-text-color);
  }
  .ant-input-affix-wrapper.tree-search-input > input.ant-input {
    background-color: var(--private-bg-2) !important;
  }
  .ant-input-affix-wrapper.tree-search-input {
    background-color: var(--private-bg-2) !important;
  }
}
.org-tree-wrap {
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: var(--private-primary-color-1);
    color: var(--ant-primary-color);
  }
}
</style>
