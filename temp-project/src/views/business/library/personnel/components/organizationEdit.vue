<template>
  <CustomDrawer :width="600" placement="right" :visible="visible" title="编辑企业组织" v-bind="{ onCancel: () => handleClose() }">
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
        <a-button type="link" @click="handleAddParent">
          <template #icon><PlusOutlined /></template>
          添加
        </a-button>
      </div>
      <div class="content">
        <a-tree
          v-model:selectedKeys="selectedKeys"
          :expanded-keys="expandedKeys"
          :tree-data="treeData"
          :auto-expand-parent="autoExpandParent"
          @expand="onExpand"
          :fieldNames="{ children: 'children', title: 'companyOrgName', key: 'companyOrgId' }"
        >
          <template #title="{ companyOrgName, companyOrgId, level, edit, children, add, parentId, defaultOrNot }">
            <div class="tree-content">
              <template v-if="edit || add">
                <div class="editable-cell-input-wrapper">
                  <a-input
                    v-model:value="ediTreeData[companyOrgId].companyOrgName"
                    :class="{ 'tree-edit-input': true, 'input-status-error': isNull(ediTreeData[companyOrgId].companyOrgName) && !add }"
                    @pressEnter="handleSave({ companyOrgId })"
                    style="width: 300px"
                    placeholder="请输入组织名称"
                    :maxlength="20"
                    allowClear
                    showCount
                  />
                  <a-button type="link" @click.stop="handleSave({ companyOrgId })"><check-outlined class="editable-cell-icon-check" /></a-button>
                  <a-popconfirm title="确定取消当前操作吗?" ok-text="是" cancel-text="否" @confirm.stop="handleCancel({ companyOrgId })">
                    <a-button type="link" danger>
                      <close-outlined style="fill: var(--ant-error-color)" class="editable-cell-icon-check" />
                    </a-button>
                  </a-popconfirm>
                </div>
              </template>
              <template v-else>
                <div class="tree-title edit-tree-title text-ellipsis">
                  <span v-if="companyOrgName?.indexOf(searchValue) > -1" class="text-ellipsis">
                    {{ companyOrgName?.substr(0, companyOrgName?.indexOf(searchValue)) }}
                    <span style="color: var(--ant-primary-color); background-color: var(--private-primary-color-1)">{{ searchValue }}</span>
                    {{ companyOrgName?.substr(companyOrgName?.indexOf(searchValue) + searchValue.length) }}
                  </span>
                  <span class="text-ellipsis" v-else>
                    {{ companyOrgName }}
                  </span>
                </div>
                <div class="tree-content-action">
                  <div class="tree-content-action-wrap">
                    <a-tooltip title="新增" v-if="level < maxLevel && !defaultOrNot">
                      <a
                        class="a-button"
                        v-hiddenS="['business:library:platform:personnel:org:add']"
                        @click.stop="handleAdd({ companyOrgId, level, children, parentId })"
                      >
                        <IconSvg name="add" class="tree-action-icon"></IconSvg>
                      </a>
                    </a-tooltip>
                    <a-tooltip title="编辑">
                      <a class="a-button" v-hiddenS="['business:library:platform:personnel:org:edit']" @click.stop="handleSort({ companyOrgId })">
                        <IconSvg name="edit" class="tree-action-icon"></IconSvg>
                      </a>
                    </a-tooltip>

                    <a-tooltip title="删除" v-if="defaultOrNot ? false : children.length <= 0">
                      <a
                        class="a-button"
                        v-hiddenS="['business:library:platform:personnel:org:delete']"
                        @click.stop="handleDelete({ companyOrgId, companyOrgName })"
                      >
                        <IconSvg name="delete" class="tree-action-icon"></IconSvg>
                      </a>
                    </a-tooltip>
                    <!-- <a-tooltip title="排序">
                      <a class="a-button" v-hiddenS="['business:library:platform:personnel:sort']" @click.stop="handleSort({ companyOrgId })">
                        <IconSvg name="sort" class="tree-action-icon"></IconSvg>
                      </a>
                    </a-tooltip> -->
                  </div>
                </div>
              </template>
            </div>
          </template>
        </a-tree>
      </div>
    </div>
    <template #footer>
      <div class="ant-drawer-footer-custom">
        <a-button @click="() => handleClose()">关闭</a-button>
      </div>
    </template>
  </CustomDrawer>
  <Sort
    v-bind="{
      ...unref(sortState),
      onOk: () => {
        handleSearch();
        sortState.visible = false;
      },
      onCancel: () => {
        sortState.visible = false;
      }
    }"
  ></Sort>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { getExpandedTreeByNumber, changeTreePositionData, isNull, isString, getParentKeys, deleteCallBack } from '@/utils/utils';
import { organizationDelete, organizationUpdate, organizationCreate, organizationList } from '@/api/business/organization';
import { message } from 'ant-design-vue';
import Modal from '@/components/Modal';
import _ from 'lodash';
import Sort from './sort';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: null
  },
  companyId: {
    type: String,
    default: null
  },
  expandMax: {
    type: Number,
    default: 2
  },
  maxLevel: {
    type: Number,
    default: 5
  },
  defaultSelectedKeys: {
    type: Array,
    default: []
  }
});

const formRef = ref(null);
const isCreate = ref(true);
const formState = ref({});
const searchValue = ref(null);
const expandedKeys = ref([]);
const treeData = ref([]);
const ediTreeData = reactive({});
const selectedKeys = ref([]);
const autoExpandParent = ref(false);
let dataList = [];
const sortState = reactive({
  visible: false,
  requestParam: null
});

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
    selectedKeys.value = props.defaultSelectedKeys || [];
    dataList = result?.data;
  } catch (error) {
    console.error('organization-handleSearch', error);
  }
};

watch(
  () => props.companyId,
  async (val) => {
    if (!isNull(val)) {
      await handleSearch({ companyId: val });
      expandedKeys.value = expandedKeys.value?.length
        ? expandedKeys.value
        : getExpandedTreeByNumber(_.cloneDeep(treeData.value), 'companyOrgId', props.expandMax);
    }
  },
  { immediate: true }
);

const onExpand = (keys) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

// 编辑
const handleEdit = async ({ companyOrgId, companyOrgName, parentId }) => {
  try {
    ediTreeData[companyOrgId] = { companyOrgName, companyOrgId, parentId };
    changeTreePositionData({ tree: treeData.value, idKey: 'companyOrgId', idValue: companyOrgId, changeKey: 'edit', changeValue: true });
  } catch (error) {
    console.error('organization-handleEdit', error);
  }
};

// 添加顶级
const handleAddParent = async ({}) => {
  const count = treeData.value.length;
  await handleSearch();
  const newData = {
    companyOrgName: ``,
    add: true,
    companyOrgId: `${count}-private`,
    sort: 0
  };
  ediTreeData[newData?.companyOrgId] = { ...newData };
  treeData.value.unshift(newData);
};

// 添加 子级
const handleAdd = async ({ companyOrgId, level, children = [], parentId }) => {
  try {
    const count = children.length;
    // FIXME:展开当前级
    expandedKeys.value.push(companyOrgId);
    // FIXME:新增需要判断层级，如果当前层级===props.maxLevel
    if (level < props.maxLevel) {
      const newData = {
        companyOrgName: ``,
        add: true,
        companyOrgId: `${companyOrgId}-private-${count}`,
        sort: 0,
        parentId: companyOrgId
      };
      ediTreeData[newData?.companyOrgId] = { ...newData };
      changeTreePositionData({
        tree: treeData.value,
        idKey: 'companyOrgId',
        idValue: companyOrgId,
        changeKey: 'children',
        changeValue: [newData, ...children]
      });
    } else {
      message.warning('层级最多五级');
    }
  } catch (error) {
    console.error('organization-handleAdd', error);
  }
};

// 保存
const handleSave = async ({ companyOrgId }) => {
  try {
    const current = ediTreeData[companyOrgId] || {};
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{1,20}$/;
    if (isNull(current?.companyOrgName)) {
      message.error('请输入组织名称');
      return;
    } else if (!reg.test(current?.companyOrgName) && !isNull(current?.companyOrgName)) {
      message.error('请输入1~20位汉字、大小写英文字母、数字、常用符号');
      return;
    }
    const API = current?.add ? organizationCreate : organizationUpdate;
    await API({
      companyId: props.companyId,
      companyOrgId,
      companyOrgName: current?.companyOrgName,
      parentId: current?.parentId || 0,
      sort: current?.sort || 0
    });
    await handleSearch();
    delete ediTreeData[companyOrgId];
  } catch (error) {
    console.error('organization-handleSave', error);
  }
};

const filterTree = ({ tree, idKey = 'companyOrgId', idValue }) => {
  if (isNull(idValue)) return;
  const newTree = tree.filter((x) => x[idKey] !== idValue);
  newTree.forEach((x) => x.children && (x.children = filterTree({ tree: x.children, idValue })));
  return newTree;
};

// 取消按钮
const handleCancel = ({ companyOrgId }) => {
  const current = ediTreeData[companyOrgId] || {};
  const isCreate = current?.add;
  if (isCreate) {
    const filterData = filterTree({ tree: treeData.value, idValue: companyOrgId });
    treeData.value = filterData;
  } else {
    changeTreePositionData({ tree: treeData.value, idKey: 'companyOrgId', idValue: companyOrgId, changeKey: 'edit', changeValue: false });
  }
  delete ediTreeData[companyOrgId];
};

// 删除
const handleDelete = async ({ companyOrgId, companyOrgName }) => {
  console.log('id', companyOrgId);
  try {
    Modal['delete']({
      title: `您确定删除“${companyOrgName}”结构?`,
      content: '确定删除后，系统将不存在此组织结构',
      async onCancel() {
        const result = await organizationDelete({ companyOrgId });
        deleteCallBack(result, '不能删除此数据').then((res) => handleSearch());
      }
    });
  } catch (error) {
    console.error('organization-handleDelete', error);
  }
};

// 排序
const handleSort = ({ companyOrgId }) => {
  sortState.visible = true;
  sortState.requestParam = { companyId: props.companyId, companyOrgId };
};

// 关闭抽屉
const handleClose = () => {
  props.close && props.close();
};
</script>

<style lang="less">
.ant-dropdown-menu-title-content {
  .a-button:hover {
    color: var(--ant-primary-color);
  }
}
</style>
