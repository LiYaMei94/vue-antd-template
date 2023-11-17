<template>
  <ListLeftCard ref="listLeftCardRef">
    <Organization ref="organizationRef"></Organization>
  </ListLeftCard>
  <div
    class="list-table-content"
    :style="{
      minWidth: 'calc(100% - 300px)',
      maxWidth: !listLeftCardCollapsed ? 'calc(100% - 200px)' : '100%'
    }"
  >
    <ProTable
      ref="proTableRef"
      v-bind="{
        formConfig: formConfig(),
        columns: columns(),
        requestApi: personnelList,
        rowKey: 'userId',
        firstRequestAuto: false,
        defaultSearchParams,
        scroll: { x: 1000 },
        formatSearchParams
      }"
    >
      <template #tableHeaderLeft>
        <div class="table-name">{{ selectedNodes?.length ? selectedNodes[0]?.supervisionName : '监管组织人员' }}</div>
      </template>
      <template #toolButton>
        <AddButton v-bind="{ onClick: () => handleOpen({ type: CREATE }) }"></AddButton>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { text, column, record, index } }">
        <template v-if="column?.dataIndex === 'status'">
          <StatusSwitch
            v-bind="{
              text,
              params: { record, index },
              type: 'switch',
              auth: ['business:library:platform:personnel:forbidden'],
              disabled: true
            }"
          ></StatusSwitch>
        </template>
        <template v-if="column?.dataIndex === 'action'">
          <ActionButtonCol>
            <a-button type="link" @click="handleEditOpen({ type: EDIT, id: record.userId })">职位/角色</a-button>
            <DeleteButton v-bind="{ ...deleteButtonProps(record) }" v-hiddenS="['business:library:platform:personnel:remove']"></DeleteButton>
          </ActionButtonCol>
        </template>
      </template>
    </ProTable>
    <Add v-bind="{ ...unref(state), close, defaultParams: defaultSearchParams }" v-if="state.type"></Add>
    <Edit v-bind="{ ...unref(configState), close: handleEditClose }"></Edit>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted, watchEffect } from 'vue';
import { CREATE, EDIT } from '@/utils/const';
import { personnelList, personnelDelete } from '@/api/supervision/group/personnel';
import { getDictDataValue } from '@/api/system/dict';
import { filterEnum, isNull, deleteCallBack } from '@/utils/utils';
import Edit from './edit.vue';
import Add from './add';
import _ from 'lodash';
import ListLeftCard from '@/components/PageComs/ListLeftCard';
import Organization from './components/organization';
import { useStore } from 'vuex';
import Modal from '@/components/Modal';

const { dispatch } = useStore();

// 编辑、新增 弹窗
const state = reactive({
  type: '',
  id: null,
  visible: false
});

const configState = reactive({
  id: null,
  visible: false
});

const listLeftCardRef = ref();
const proTableRef = ref();
const organizationRef = ref();

const listLeftCardCollapsed = computed(() => listLeftCardRef.value?.listLeftCardCollapsed);
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const updateRowData = computed(() => proTableRef.value?.updateRowData); // 刷新指定行数据
const selectedOrganizationKeys = computed(() => organizationRef.value?.selectedOrganizationKeys);
const selectedNodes = computed(() => organizationRef.value?.selectedNodes);

const defaultSearchParams = ref({});
const sexEnum = ref([]);
const resetPasswordState = reactive({
  visible: false,
  requestParam: null
});

onMounted(async () => {
  try {
    // FIXME:有ListLeftCard需要收齐侧边栏
    dispatch('setLayoutSiderCollapsed', true);
    // 用户性别
    const sexData = await getDictDataValue({ dictType: 'user_sex' });
    sexEnum.value = sexData?.data || [];
  } catch (error) {
    console.error('personnel-list-onMounted', error);
  }
});

watch(
  selectedOrganizationKeys,
  (selectedKey) => {
    // 组织是必填项
    if (!isNull(selectedKey)) {
      const params = { supervisionId: selectedKey.length ? selectedKey[0] : '' };
      defaultSearchParams.value = params;
      search.value && search.value({ ...params });
    }
  },
  { deep: true, immediate: true }
);

const handleOpen = ({ type, id }) => {
  state.visible = true;
  state.id = id;
  state.type = type;
};

const close = (refresh = false) => {
  state.visible = false;
  state.type = '';
  refresh && search.value && search.value();
};

const handleEditOpen = ({ type, id }) => {
  configState.visible = true;
  configState.id = id;
};

const handleEditClose = () => {
  configState.visible = false;
};

const deleteButtonProps = (record) => {
  const length = record?.children?.length;
  const { realName, userId } = record || {};
  return {
    title: `您确定删除“${realName}”吗?`,
    content: `确定删除后，系统将不存在此人员信息`,
    deleteRequest: () => handleDelete(userId)
  };
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (id) => {
  try {
    const userIds = !isNull(id) ? (!Array.isArray(id) ? [id] : id) : [];
    const result = await personnelDelete({ userIds: userIds.join(',') });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('personnel-list-handleDelete', error);
  }
};

const formatSearchParams = ({ realName, ...other }) => {
  return { ...other, userName: realName, phoneNumber: realName, realName };
};

// 表单配置
const formConfig = () => {
  return [
    {
      value: 'realName',
      el: 'input',
      props: {
        placeholder: '姓名/手机号/账号'
      }
    }
  ];
};

// table配置
const columns = () => {
  return [
    {
      title: '姓名',
      dataIndex: 'realName',
      ellipsis: true,
      width: 210,
      disabled: true
    },
    {
      title: '性别',
      dataIndex: 'sex',
      customRender({ text }) {
        return filterEnum(text, sexEnum.value, { label: 'dictLabel', value: 'dictValue' });
      },
      width: 80
    },
    {
      title: '账号',
      dataIndex: 'userName',
      ellipsis: true,
      width: 210
    },

    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      ellipsis: true,
      width: 210
    },
    {
      title: '职位',
      dataIndex: 'position',
      ellipsis: true,
      width: 210,
      customRender({ text }) {
        return text?.positionName;
      }
    },
    {
      title: '角色',
      dataIndex: 'companyRoleList',
      ellipsis: true,
      width: 210,
      customRender({ text }) {
        return _.join(_.map(text, 'roleName'));
      }
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      width: 80
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      disabled: true,
      width: 150
    }
  ];
};
</script>
<style lang="less" scoped></style>
