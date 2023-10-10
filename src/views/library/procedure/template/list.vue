<template>
  <div class="list-table-content">
    <ProTable ref="proTableRef" v-bind="{ formConfig, columns, requestApi: procedureTelList, rowKey: 'roleId' }">
      <template #tableHeaderLeft>
        <a-button type="primary" @click="handleOpen({ type: CREATE })">添加</a-button>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { column, record } }">
        <template v-if="column?.dataIndex === 'action'">
          <a-space>
            <a class="table-custom-primary" @click="handleOpenAuth({ type: EDIT, id: record.roleId })">权限配置</a>
            <a class="table-custom-primary" @click="handleOpen({ type: EDIT, id: record.roleId })">修改</a>
            <DeleteButton v-bind="{ ...deleteButtonProps(record) }"></DeleteButton>
          </a-space>
        </template>
      </template>
    </ProTable>
    <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted, h } from 'vue';
import Edit from './edit';
import {
  CREATE,
  EDIT,
  DETAIL,
  ENABLE_DISABLE_STATUS_ENUM,
  CONST_STRING_0,
  CONST_STRING_1,
  ROLE_TYPE_ENUM,
  DISABLED_ACTION_ROLE_TYPE
} from '@/utils/const';
import { procedureTelList, procedureTelDelete } from '@/api/library/procedure';
import { useStore } from 'vuex';
import { filterEnum, isNull } from '@/utils/utils';
import { dateFormat } from '@/utils/day';

const { state: storeState } = useStore();

// 角色编辑、新增 弹窗
const state = reactive({
  type: '',
  id: null,
  visible: false
});

const proTableRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const updateRowData = computed(() => proTableRef.value?.updateRowData); // 刷新指定行数据

const deleteButtonProps = (record) => {
  const { roleName, roleId } = record || {};
  return {
    modalOptions: {
      title: '角色删除',
      content: (
        <div>
          <span>确定要删除【{roleName}】吗？</span>
          <br />
          <span>关联该角色的账号将失去角色权限。</span>
        </div>
      )
    },
    deleteFun: () => handleDelete(roleId)
  };
};

// 打开角色编辑、新增
const handleOpen = ({ type, id }) => {
  state.visible = true;
  state.id = id;
  state.type = type;
};

// 关闭角色编辑、新增
const close = (refresh = false) => {
  state.visible = false;
  state.type = '';
  refresh && search.value && search.value();
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (id) => {
  try {
    const roleIds = !isNull(id) ? (!Array.isArray(id) ? [id] : id) : [];
    await procedureTelDelete({ roleIds: roleIds.join(',') });
    search.value && search.value();
  } catch (error) {
    console.error('library-procedure-template-list-handleDelete', error);
  }
};

// 表单配置
const formConfig = [
  {
    label: '角色名称',
    value: 'roleName',
    el: 'input'
  },
  {
    label: '启用状态',
    value: 'status',
    el: 'select',
    props: {
      options: ENABLE_DISABLE_STATUS_ENUM,
      showSearch: true,
      optionFilterProp: 'label'
    }
  },
  {
    label: '角色类型',
    value: 'roleType',
    el: 'select',
    props: {
      options: ROLE_TYPE_ENUM,
      showSearch: true,
      optionFilterProp: 'roleTypeName',
      fieldNames: { label: 'roleTypeName', value: 'roleType' }
    }
  }
];

// table配置
const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    ellipsis: true,
    customRender: ({ text, record }) => {
      return (
        <a class='table-custom-primary' onClick={() => handleOpen({ type: DETAIL, id: record.roleId })}>
          {text}
        </a>
      );
    }
  },
  {
    title: '角色类型',
    dataIndex: 'roleType',
    customRender({ text }) {
      return filterEnum(text, [...ROLE_TYPE_ENUM], { label: 'roleTypeName', value: 'roleType' });
    }
  },
  {
    title: '角色权限',
    dataIndex: 'roleKey',
    show: false
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '排序',
    dataIndex: 'roleSort',
    show: false,
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return dateFormat(text);
    },
    width: 150
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    disabled: true,
    width: 180
  }
];
</script>
