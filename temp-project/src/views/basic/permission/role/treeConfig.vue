<template>
  <div class="auth-config-container">
    <div class="operation-container">
      <a-checkbox v-model:checked="isExpand" @change="onCheckExpand">展开/折叠</a-checkbox>
      <a-checkbox v-model:checked="isAllchecked" :indeterminate="indeterminate" @change="onCheckAllChange">全选/全不选</a-checkbox>
      <a-checkbox v-model:checked="isCheckStrictly" disabled>父子联动</a-checkbox>
    </div>
    <div class="tree-container">
      <a-tree
        checkable
        :tree-data="treeData"
        v-model:expandedKeys="expandedKeys"
        v-model:checkedKeys="checkedKeys"
        :fieldNames="{ children: children, title: nodeTitle, key: nodeKey }"
        v-if="treeData.length"
        @check="onCheck"
      ></a-tree>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, watch, onMounted } from 'vue';
import { arrayToTree, getExpandedTreeByNumber, getAllLeafNodes } from '@/utils/utils';

const props = defineProps({
  detailApi: {
    type: Function,
    default: null
  },
  configApi: {
    type: Function,
    default: null
  },
  roleId: {
    type: [String, Number]
  },
  nodeKey: {
    type: String
  },
  nodeTitle: {
    type: String
  },
  children: {
    type: String
  },
  nodeParentKey: {
    type: String
  }
});
const formState = ref({
  roleName: ''
});
let allMenuIds = [];
let allLeafNodeIds = [];
let treeData = ref([]); //节点数
let checkedKeys = ref([]); //勾选状态
const halfCheckedKeys = ref([]); //半选状态
const expandedKeys = ref([]);
let isExpand = ref(true);
let isAllchecked = ref(false);
let indeterminate = ref(true);
const isCheckStrictly = ref(true);
// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await props.detailApi({ roleId: props.roleId });
    formState.value.roleName = detail?.data?.roleName || '';
    treeData.value = arrayToTree(detail?.data?.assignableMenus, props.nodeKey, props.nodeParentKey);
    if (isExpand.value) {
      expandedKeys.value = getExpandedTreeByNumber(treeData.value, props.nodeKey, 3); //默认展开3级
    }
    allMenuIds = detail?.data?.assignableMenus.map((item) => item[props.nodeKey]); //所有节点（包含叶子节点和非叶子节点）
    allLeafNodeIds = getAllLeafNodes(treeData.value).map((item) => item[props.nodeKey]); //所有叶子节点，用于顶部 全选/全不选 复选框的状态判断
    checkedKeys.value = resolveAllLeafNodeId(treeData.value, detail?.data?.assignedMenuIds, []); //选中叶子节点
    halfCheckedKeys.value = detail?.data?.assignedMenuIds.filter((v) => checkedKeys.value.every((val) => val != v)); //因为三级菜单是动态的，所以半选节点不光是在树这里要用
  } catch (error) {
    console.error('role-getDetail', error);
  }
};
const onCheckExpand = (keys, event) => {
  if (isExpand.value) {
    expandedKeys.value = getExpandedTreeByNumber(treeData.value, props.nodeKey, 3);
  } else {
    expandedKeys.value = [];
  }
};
const onCheckAllChange = (keys, event) => {
  if (isAllchecked.value) {
    checkedKeys.value = allMenuIds;
  } else {
    checkedKeys.value = [];
  }
};
//解析所有选中的叶子节点
const resolveAllLeafNodeId = (treeData, idArr, temp = []) => {
  for (const item of treeData) {
    if (item[props.children] && item[props.children].length !== 0) {
      resolveAllLeafNodeId(item[props.children], idArr, temp);
    } else {
      temp.push(...idArr.filter((id) => id === item[props.nodeKey]));
    }
  }
  return temp;
};
const onCheck = (keys, event) => {
  halfCheckedKeys.value = event.halfCheckedKeys;
};
watch(
  () => checkedKeys.value,
  (val) => {
    //用叶子节点来判断
    let allLeafNodeIdArray = resolveAllLeafNodeId(treeData.value, val, []); //选中当前选中的叶子节点，checkedKeys是指复选框被选中的节点，所以其中包含了非叶子节点
    indeterminate.value = !!allLeafNodeIdArray.length && allLeafNodeIdArray.length < allLeafNodeIds.length;
    isAllchecked.value = allLeafNodeIdArray.length === allLeafNodeIds.length;

    //因为获取详情后给checkedKeys.value赋值为叶子节点了，所以val在后续操作有时候是叶子节点的数，有时候是所有选中复选框的数
    // indeterminate.value = !!val.length && val.length < allMenuIds.length;
    // isAllchecked.value = val.length === allMenuIds.length;
  },
  { deep: true, immediate: false }
);
onMounted(async () => {
  try {
    props.roleId && (await getDetail());
  } catch (error) {
    console.error('role-detail-onMounted', error);
  }
});

// 提交配置
const submitConfig = async () => {
  try {
    await props.configApi({ roleId: props?.roleId, menuIds: [...checkedKeys.value, ...halfCheckedKeys.value] });
  } catch (error) {
    console.error('role-config-onSubmit', error);
  }
};
defineExpose({ submitConfig });
</script>

<style lang="less" scoped>
.auth-config-container {
  padding-left: 85px;
}
.card-header-title {
  display: flex;
}
.operation-container {
  margin-bottom: 18px;
}
.tree-container {
  height: 547px;
  width: 289px;
  padding: 4px 8px;
  border-radius: 2px;
  background: var(--private-content-bg);
  box-shadow: 0px 0px 8px 0px rgba(15, 41, 77, 0.08);
  overflow: auto;
}
</style>
