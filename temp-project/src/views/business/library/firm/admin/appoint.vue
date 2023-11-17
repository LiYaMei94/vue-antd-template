<template>
  <CustomDrawer
    :width="1210"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false), isDetail }"
  >
    <div class="transfer-container">
      <div class="source-area">
        <div class="left-title">待选</div>
        <div class="org-user-selector">
          <div class="organization-selector" style="margin-right: 16px">
            <Organization v-bind="{ companyId }" ref="organizationRef"></Organization>
          </div>
          <div class="user-selector">
            <div class="search-form">
              <SearchForm v-bind="{ formConfig, defaultSearchParams, search, searchFormCol: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 } }"></SearchForm>
            </div>
            <div>
              <a-table
                ref="leftTableRef"
                :columns="tansferTableColumns"
                :dataSource="tableDataLeft"
                :pagination="false"
                rowKey="userId"
                :row-selection="{ selectedRowKeys: state.leftSelectedRowKeys, onChange: onLeftSelectChange, getCheckboxProps }"
              ></a-table>
              <!-- <div class="table-pagination">
                <a-pagination v-if="page.total > 0" v-bind="{ ...config, ...page }" :total="page.total" @change="handleChange" />
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="left-right-area">
        <a-button type="primary" :disabled="state.leftSelectedRowKeys.length > 0 ? false : true" @click="transToRight">
          <template #icon><right-outlined /></template>
        </a-button>
        <!-- <a-button
          type="primary"
          :disabled="state.rightSelectedRowKeys.length > 0 ? false : true"
          @click="transToLeft"
          style="background: rgba(0, 83, 247, 0.3) !important; border: none !important; margin-top: 16px"
        >
          <template #icon><left-outlined /></template>
        </a-button> -->
      </div>
      <div class="target-area">
        <div>已选</div>
        <a-table
          ref="rightTableRef"
          :columns="rightTableColumns"
          :dataSource="tableDataRight"
          rowKey="userId"
          :pagination="false"
          :row-selection="{ selectedRowKeys: state.rightSelectedRowKeys, onChange: onRightSelectChange, getCheckboxProps }"
        >
          <template v-slot:bodyCell="{ column, record, text, index }">
            <template v-if="column?.dataIndex === 'action'">
              <a-button type="link" @click="handleDeleteRight({ column, record, text, index })">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </CustomDrawer>
</template>
<script lang="jsx" setup>
import { ref, onMounted, watch, computed, reactive, onBeforeMount } from 'vue';
import Organization from './components/organization';
import { companyAdminCreate, personnelList } from '@/api/business/companyAdmin';
import { filterEnum, isObject, isNull, deleteCallBack } from '@/utils/utils';
import { formConfig } from './config/column';
import { getDictDataValue } from '@/api/system/dict';
import { useTable } from '@/hooks/useTable';

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
    type: [String, Number]
  }
});
const searchParam = ref({});
const { config, handleSizeChange, tableData, page, getTableData, loading } =
  useTable({
    searchParam,
    requestApi: personnelList,
    firstRequestAuto: false
  }) || {};
const sexEnum = ref([]); //性别枚举
let paganition = {
  page: 1,
  pageSize: 20
};
const leftTableRef = ref();
const title = '选择管理员';
const organizationRef = ref();
// const tableDataLeft = ref([]);
const tableDataLeft = ref(tableData);
const tableDataRight = ref([]);
const selectedCompanyOrgId = computed(() => organizationRef.value?.selectedCompanyOrgId);
const defaultSearchParams = ref({ companyId: props.companyId, companyOrgId: null });
const state = reactive({
  leftSelectedRowKeys: [],
  rightSelectedRowKeys: []
});
// 查询
const search = (params) => {
  searchParam.value = { ...searchParam.value, ...params };
  getTableData && getTableData();
};
watch(
  selectedCompanyOrgId,
  (val) => {
    if (!isNull(val)) {
      defaultSearchParams.value = { ...defaultSearchParams.value, companyOrgId: val[0] };
    }
  },
  { deep: true, immediate: true }
);
watch(
  defaultSearchParams,
  (val) => {
    searchParam.value = { ...searchParam.value, ...val };
    search();
  },
  { deep: true, immediate: false }
);
const handleDeleteRight = async ({ column, record, text, index }) => {
  tableDataRight.value.splice(index, 1);
  tableDataLeft.value.push(record);
};
const onLeftSelectChange = (selectedRowKeys, selectedRows) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.leftSelectedRowKeys = selectedRowKeys;
  if (selectedRowKeys?.length > 0) {
    state.disabledLeft = false;
  }
};
const onRightSelectChange = (selectedRowKeys, selectedRows) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.rightSelectedRowKeys = selectedRowKeys;
};
const getCheckboxProps = (record) => {
  return {
    disabled: record.userType === '1'
  };
};
// 关闭抽屉
const handleClose = (refresh = false) => {
  props.close && props.close(refresh);
};
const transToRight = () => {
  const leftRemainRows = tableDataLeft.value.filter((item) => {
    return !state.leftSelectedRowKeys.includes(item.userId);
  });
  const filteredArray = tableDataLeft.value.filter((item) => {
    return state.leftSelectedRowKeys.includes(item.userId);
  });
  tableDataLeft.value = leftRemainRows;
  tableDataRight.value = [...tableDataRight.value, ...filteredArray];
  state.leftSelectedRowKeys = [];
};
const transToLeft = () => {
  const rightRemainRows = tableDataRight.value.filter((item) => {
    return !state.rightSelectedRowKeys.includes(item.userId);
  });
  const filteredArray = tableDataRight.value.filter((item) => {
    return state.rightSelectedRowKeys.includes(item.userId);
  });
  tableDataRight.value = rightRemainRows;
  tableDataLeft.value = [...tableDataLeft.value, ...filteredArray];
};
const handleChange = (page, pageSize) => {
  paganition.page = page;
  paganition.pageSize = pageSize;
  handleSizeChange && handleSizeChange({ current: page, pageSize });
};
// 提交穿梭框
const onSubmit = async () => {
  try {
    const userIds = tableDataRight.value.map((item) => {
      return item.userId;
    });
    const params = {
      companyId: props.companyId,
      userIds: userIds
    };
    await companyAdminCreate({ ...params });
    handleClose(true);
  } catch (error) {
    console.error('firm-admin-onSubmit', error);
  }
};
const getUserList = async (params) => {
  try {
    const detail = await personnelList(params);
    tableDataLeft.value = detail?.data;
  } catch (error) {
    console.error('firm-user-getUserList', error);
  }
};
onMounted(async () => {
  try {
    // 用户性别
    const sexData = await getDictDataValue({ dictType: 'user_sex' });
    sexEnum.value = sexData?.data || [];
  } catch (error) {
    console.error('personnel-sex-getSexDict-onMounted', error);
  }
});
const tansferTableColumns = [
  {
    dataIndex: 'realName',
    title: '姓名',
    ellipsis: true
  },
  {
    dataIndex: 'sex',
    title: '性别',
    customRender({ text }) {
      return filterEnum(text, sexEnum.value, { label: 'dictLabel', value: 'dictValue' });
    },
    width: 80
  },
  {
    dataIndex: 'userName',
    title: '账号',
    ellipsis: true
  },
  {
    dataIndex: 'phoneNumber',
    title: '手机号',
    ellipsis: true
  }
];
const rightTableColumns = [
  {
    dataIndex: 'realName',
    title: '姓名',
    ellipsis: true
  },
  {
    dataIndex: 'sex',
    title: '性别',
    customRender({ text }) {
      return filterEnum(text, sexEnum.value, { label: 'dictLabel', value: 'dictValue' });
    },
    width: 80
  },
  {
    dataIndex: 'userName',
    title: '账号',
    ellipsis: true
  },
  {
    dataIndex: 'phoneNumber',
    title: '手机号',
    ellipsis: true
  },
  {
    dataIndex: 'action',
    title: '操作',
    fixed: 'right'
  }
];
</script>
<style lang="less" scoped>
.transfer-container {
  display: flex;
}
.source-area {
  flex: 0.6;
  padding: 16px;
  border: 1px solid var(--private-bg-2);
  .left-title {
  }
  .org-user-selector {
    display: flex;
    .organization-selector {
      flex: 0.3;
      border-right: 1px solid var(--private-bg-2);
    }
    .user-selector {
      flex: 0.7;
      .search-form {
        margin-bottom: 20px;
      }
    }
  }
}
.left-right-area {
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .transfer-button {
    padding: 12px;
  }
}
.target-area {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--private-bg-2);
}
</style>
