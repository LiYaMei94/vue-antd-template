<template>
  <div class="custom-tree-container tree-edit-container">
    <div class="search-wrap">
      <a-input v-model:value="searchValue" style="margin-bottom: 10px" placeholder="搜索" allowClear @pressEnter="handleMath" @blur="handleMath">
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>
    <div class="title-wrap">
      <span class="text-ellipsis">企业组织结构</span>
      <a @click="categoryState.visible = true" v-if="!isNull(companyId)" v-hiddenS="['business:library:platform:personnel:org:edit']">编辑</a>
    </div>
    <div class="content">
      <a-tree
        v-model:selectedKeys="selectedKeys"
        :expanded-keys="expandedKeys"
        :tree-data="treeData"
        :auto-expand-parent="autoExpandParent"
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
  <OrganizationEdit
    v-bind="{ ...unref(categoryState), companyId, maxLevel, expandMax, defaultSelectedKeys: selectedKeys, close: handleClose }"
    v-if="categoryState.visible"
  ></OrganizationEdit>
</template>
<script setup>
import { ref, onMounted, watch, reactive, unref } from 'vue';
import { getExpandedTreeByNumber, changeTreePositionData, isNull, isString, getParentKeys } from '@/utils/utils';
import { organizationDelete, organizationUpdate, organizationCreate, organizationList } from '@/api/business/organization';
import { message } from 'ant-design-vue';
import Modal from '@/components/Modal';
import _ from 'lodash';
import OrganizationEdit from './organizationEdit';

const props = defineProps({
  expandMax: {
    type: Number,
    default: 1
  },
  maxLevel: {
    type: Number,
    default: 5
  },
  companyId: {
    type: String,
    default: null
  }
});

const searchValue = ref(null);
const expandedKeys = ref([]);
const treeData = ref([]);
const ediTreeData = reactive({});
const selectedKeys = ref([]);
const autoExpandParent = ref(false);
const categoryState = reactive({ visible: false });
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

watch(
  () => props.companyId,
  (val) => {
    if (!isNull(val)) {
      handleSearch();
    }
  },
  {
    immediate: true,
    deep: true
  }
);

const onExpand = (keys) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

// 关闭弹窗
const handleClose = () => {
  categoryState.visible = false;
  handleSearch();
};

defineExpose({ selectedCompanyOrgId: selectedKeys });
</script>
<style lang="less">
.tree-list-container {
  height: calc(100% - 47px);
  overflow: hidden;
  .content {
    height: calc(100% - 80px);
    overflow-y: auto;
  }
}
</style>
