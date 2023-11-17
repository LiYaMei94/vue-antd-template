<template>
  <!-- <div class="list-card-header"></div> -->
  <Tree
    ref="treeRef"
    v-bind="{
      treeName: '监管组织',
      getTreeData,
      fieldNames: { title: 'supervisionName', key: 'supervisionId', children: 'children' },
      initRequest,
      isSearch: false,
      isLazyLoad: true,
      defaultSelectedKeys,
      defaultExpandedKeys
    }"
  >
    <template #headerAction>
      <a @click.stop="visible = true">编辑</a>
    </template>
  </Tree>
  <OrganizationEdit
    v-if="visible"
    v-bind="{
      visible,
      onCancel,
      getTreeData,
      defaultSelectedKeys: initRequest ? defaultSelectedKeys : selectedKeys,
      defaultExpandedKeys: initRequest.value ? defaultExpandedKeys : expandedKeys
    }"
  ></OrganizationEdit>
</template>
<script setup>
import { watch, ref, computed, onMounted } from 'vue';
import Tree from '@/components/Tree';
import OrganizationEdit from './organizationEdit';
import { isNull, getExpandedTreeByNumber } from '@/utils/utils';
import { supervisionGroupList } from '@/api/supervision/group';

const visible = ref(false);
const treeRef = ref(null);
const selectedKeys = computed(() => treeRef.value?.selectedKeys);
const expandedKeys = computed(() => treeRef.value?.expandedKeys);
const selectedNodes = computed(() => treeRef.value?.selectedNodes);
const initRequest = ref(true);
const defaultSelectedKeys = ref([]);
const defaultExpandedKeys = ref([]);

const onCancel = (params) => {
  visible.value = false;
  defaultSelectedKeys.value = params?.selectedKeys?.length > 0 ? params?.selectedKeys : selectedKeys;
  defaultExpandedKeys.value = params?.expandedKeys?.length > 0 ? params?.expandedKeys : expandedKeys;
};

const getTreeData = async (params) => {
  try {
    const result = await supervisionGroupList({ parentId: '0', ...params });
    const newTreeData = _.map(result?.data, (item) => {
      return {
        ...item,
        isLeaf: !item?.hasChildren
      };
    });
    if (initRequest.value) {
      defaultSelectedKeys.value = !isNull(newTreeData[0]?.supervisionId) ? [newTreeData[0]?.supervisionId] : [];
      const firstTreeNode = newTreeData.length > 0 ? [newTreeData[0]] : [];
      defaultExpandedKeys.value = getExpandedTreeByNumber(firstTreeNode, 'supervisionId', 1);
    }
    initRequest.value = false;
    return newTreeData || [];
  } catch (error) {
    console.log('organization-getTreeData', error);
  }
};

defineExpose({ selectedOrganizationKeys: selectedKeys, selectedNodes: selectedNodes || [] });
</script>
