<template>
  <div class="list-table-content">
    <ProTable ref="proTableRef" v-bind="{ formConfig, columns, requestApi: roleList, rowKey: 'roleId' }">
      <template #toolButton>
        <AddButton v-hiddenS="['basic:permission:user:role:add']" type="primary" @click="handleOpen({ type: CREATE })">新增</AddButton>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { column, record } }">
        <template v-if="column?.dataIndex === 'action'">
          <ActionButtonCol v-bind="{ maxLength: 3 }">
            <a-button
              type="link"
              v-hiddenS="['basic:permission:user:role:edit']"
              class="table-custom-primary"
              @click="handleOpen({ type: EDIT, roleId: record.roleId })"
            >
              编辑
            </a-button>
            <a-button
              type="link"
              v-hiddenS="['basic:permission:user:role:auth']"
              class="table-custom-primary"
              @click="handleOpen({ type: AUTH, roleId: record.roleId })"
            >
              权限配置
            </a-button>
            <a-button type="link" class="table-custom-primary">角色成员</a-button>
            <DeleteButton
              v-hiddenS="['basic:permission:user:role:delete']"
              v-bind="{ ...deleteButtonProps(record) }"
              style="width: 100%"
            ></DeleteButton>
          </ActionButtonCol>
        </template>
      </template>
    </ProTable>
    <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted, h } from 'vue';
import Edit from './edit';
import { CREATE, EDIT, DETAIL, AUTH, ROLE_TYPE_ENUM } from '@/utils/const';
import { roleList, roleDelete } from '@/api/role';
import { useStore } from 'vuex';
import { filterEnum, isNull, deleteCallBack } from '@/utils/utils';
import { dateFormat } from '@/utils/day';

const { state: storeState } = useStore();

// 角色编辑、新增 弹窗
const state = reactive({
  type: '',
  roleId: null,
  visible: false
});

const proTableRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const updateRowData = computed(() => proTableRef.value?.updateRowData); // 刷新指定行数据

const deleteButtonProps = (record) => {
  const { roleName, roleId } = record || {};
  return {
    title: `您确定删除“${roleName}”角色?`,
    content: `确定删除后，系统将不存在此角色`,
    deleteRequest: () => handleDelete(roleId)
  };
};

// 打开角色编辑、新增
const handleOpen = ({ type, roleId }) => {
  state.visible = true;
  state.roleId = roleId;
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
    // await roleDelete({ roleIds: roleIds.join(',') });
    // search.value && search.value();

    const result = await roleDelete({ roleIds: roleIds.join(',') });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('role-handleDelete', error);
  }
};

// 表单配置
const formConfig = [
  {
    label: '', //角色名称
    // label: '',
    value: 'roleName',
    el: 'input',
    props: {
      placeholder: '角色名称'
    }
  },
  {
    label: '', //角色类型
    value: 'roleType',
    el: 'select',
    props: {
      options: ROLE_TYPE_ENUM,
      showSearch: true,
      optionFilterProp: 'label'
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
        <a
          v-disabledS={['basic:permission:user:role:detail']}
          class='table-custom-primary'
          onClick={() => handleOpen({ type: DETAIL, roleId: record.roleId })}
        >
          {text}
        </a>
      );
    }
  },
  {
    title: '角色类型',
    dataIndex: 'roleTypeName',
    width: 200
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
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
