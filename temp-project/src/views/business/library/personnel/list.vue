<template>
  <ListLeftCard ref="listLeftCardRef">
    <div class="list-card-header">
      <a-row style="width: 100%; align-items: center">
        <a-col style="width: 40px">企业</a-col>
        <a-col style="width: calc(100% - 40px)">
          <a-select
            v-model:value="defaultSearchParams.companyId"
            allowClear
            showSearch
            :fieldNames="{ label: 'companyName', value: 'companyId' }"
            optionFilterProp="companyName"
            placeholder="请选择企业"
            :options="companyList"
            style="width: 100%"
          ></a-select>
        </a-col>
      </a-row>
    </div>
    <Organization v-bind="{ companyId: defaultSearchParams?.companyId }" ref="organizationRef"></Organization>
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
        scroll: { x: 1000 }
      }"
    >
      <template #tableHeaderLeft>
        <div class="table-name">组织人员</div>
      </template>
      <template #toolButton>
        <AddButton v-bind="{ onClick: () => handleOpen({ type: CREATE }) }"></AddButton>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { text, column, record, index } }">
        <template v-if="column?.dataIndex === 'status'">
          <StatusSwitch
            v-bind="{
              text,
              handleStatusChange,
              params: { record, index },
              type: 'switch',
              auth: ['business:library:platform:personnel:forbidden']
            }"
          ></StatusSwitch>
        </template>
        <template v-if="column?.dataIndex === 'action'">
          <ActionButtonCol>
            <a-button type="link" @click="handleOpen({ type: EDIT, id: record.userId })" v-hiddenS="['business:library:platform:personnel:edit']">
              编辑
            </a-button>
            <DeleteButton v-bind="{ ...deleteButtonProps(record) }" v-hiddenS="['business:library:platform:personnel:remove']"></DeleteButton>
            <a-button type="link" @click="handleResetPassword({ id: record.userId })" v-hiddenS="['business:library:platform:personnel:resetPwd']">
              重置密码
            </a-button>
          </ActionButtonCol>
        </template>
      </template>
    </ProTable>
    <Edit v-bind="{ ...unref(state), close, defaultParams: defaultSearchParams }" v-if="state.type"></Edit>
    <ResetPassword
      v-bind="{
        ...unref(resetPasswordState),
        onOk: () => {
          resetPasswordState.visible = false;
        },
        onCancel: () => {
          resetPasswordState.visible = false;
        }
      }"
    ></ResetPassword>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted, watchEffect } from 'vue';
import { CREATE, EDIT, DETAIL, CONST_STRING_0, CONST_STRING_1 } from '@/utils/const';
import { companyEnum } from '@/api/business/company';
import { personnelList, personnelDelete, personnelStatusChange } from '@/api/business/personnel';
import { getDictDataValue } from '@/api/system/dict';
import { filterEnum, isObject, isNull, deleteCallBack } from '@/utils/utils';
import { dateFormat } from '@/utils/day';
import Edit from './edit.vue';
import _ from 'lodash';
import ListLeftCard from '@/components/PageComs/ListLeftCard';
import Organization from './components/organization';
import { useStore } from 'vuex';
import ResetPassword from '@/components/BusinessComponents/ResetPassword';
import Modal from '@/components/Modal';

const { dispatch } = useStore();

// 编辑、新增 弹窗
const state = reactive({
  type: '',
  id: null,
  visible: false
});

const listLeftCardRef = ref();
const proTableRef = ref();
const organizationRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const updateRowData = computed(() => proTableRef.value?.updateRowData); // 刷新指定行数据
const defaultSearchParams = ref({ companyId: null, companyOrgId: null });
const companyList = ref([]);
const employeeTypeEnum = ref([]);
const selectedCompanyOrgId = computed(() => organizationRef.value?.selectedCompanyOrgId);
const sexEnum = ref([]);
const resetPasswordState = reactive({
  visible: false,
  requestParam: null
});
const listLeftCardCollapsed = computed(() => listLeftCardRef.value?.listLeftCardCollapsed);

onMounted(async () => {
  try {
    // FIXME:有ListLeftCard需要收齐侧边栏
    dispatch('setLayoutSiderCollapsed', true);
    // 企业枚举
    const companyData = await companyEnum({});
    companyList.value = companyData?.data;
    // 员工类别
    const employeeTypeData = await getDictDataValue({ dictType: 'employee_type' });
    employeeTypeEnum.value = employeeTypeData?.data || [];
    defaultSearchParams.value.companyId = companyList.value[0]?.companyId;
    // 用户性别
    const sexData = await getDictDataValue({ dictType: 'user_sex' });
    sexEnum.value = sexData?.data || [];
  } catch (error) {
    console.error('personnel-list-onMounted', error);
  }
});

watch(
  selectedCompanyOrgId,
  (val) => {
    if (!isNull(val) && !_.isEmpty(val)) {
      defaultSearchParams.value = { ...defaultSearchParams.value, companyOrgId: val[0] };
    }
  },
  { deep: true, immediate: true }
);

watch(
  defaultSearchParams,
  (val) => {
    if (!Object.values(val).some((v) => isNull(v))) {
      search.value && search.value({ ...val });
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
    const result = await personnelDelete({ companyId: defaultSearchParams.value?.companyId, userIds: userIds.join(',') });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('personnel-list-handleDelete', error);
  }
};

const handleResetPassword = ({ id }) => {
  resetPasswordState.visible = true;
  resetPasswordState.requestParam = {
    ...defaultSearchParams.value,
    userId: id
  };
};

const handleStatusChange = async (options) => {
  try {
    const { event: status, record, index } = options || {};
    Modal.confirm({
      title: '账号状态变更',
      content: status === CONST_STRING_1 ? `您是否确定【启用】该账号，启用后账号将恢复登陆。` : `您是否确定【停用】该账号，停用后账号将无法登陆。`,
      onOk: async () => {
        await personnelStatusChange({ ...record, ...defaultSearchParams.value, status });
        updateRowData.value && updateRowData.value({ ...record, status }, index);
      }
    });
  } catch (error) {
    console.error('personnel-list-handleStatusChange', error);
  }
};

// 表单配置
const formConfig = () => {
  return [
    {
      value: 'realName',
      el: 'input',
      props: {
        placeholder: '姓名'
      }
    },
    {
      value: 'userName',
      el: 'input',
      props: {
        placeholder: '账号'
      }
    },
    {
      value: 'employeeType',
      el: 'select',
      props: {
        options: employeeTypeEnum.value,
        optionFilterProp: 'dictLabel',
        allowClear: true,
        showSearch: true,
        fieldNames: { label: 'dictLabel', value: 'dictValue' },
        placeholder: '员工类别'
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
      customRender: ({ text, record }) => {
        return (
          <a
            class='table-custom-primary'
            v-disabledS={['business:library:platform:personnel:detail']}
            onClick={() => handleOpen({ type: DETAIL, id: record.userId })}
          >
            {text}
          </a>
        );
      },
      ellipsis: true,
      width: 210,
      disabled: true
    },
    {
      title: '账号',
      dataIndex: 'userName',
      ellipsis: true,
      width: 210
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
      title: '电话',
      dataIndex: 'phoneNumber',
      ellipsis: true,
      width: 210
    },
    {
      title: '关联项目',
      dataIndex: 'AssociatedProjects',
      width: 80,
      ellipsis: true,
      customRender({ text }) {
        return 'TODO：此功能待开发';
      }
    },
    {
      title: '员工类别',
      dataIndex: 'employeeType',
      customRender({ text }) {
        return filterEnum(text, employeeTypeEnum.value, { label: 'dictLabel', value: 'dictValue' });
      },
      width: 100
    },
    {
      title: '账号状态',
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
