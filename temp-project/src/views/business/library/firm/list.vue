<template>
  <div class="list-table-content">
    <ProTable
      ref="proTableRef"
      v-bind="{
        formConfig: formConfig(),
        columns: columns(),
        requestApi: companyList,
        rowKey: 'companyId',
        scroll: { x: 1000 }
      }"
    >
      <template #tableHeaderLeft>
        <div class="table-name">入驻企业</div>
      </template>
      <template #toolButton>
        <AddButton v-hiddenS="['business:library:platform:firm:list:add']" v-bind="{ onClick: () => handleOpen({ type: CREATE }) }"></AddButton>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { column, record } }">
        <template v-if="column?.dataIndex === 'action'">
          <ActionButtonCol>
            <a-button type="link" @click="handleOpenAdmin({ companyId: record.companyId })" v-hiddenS="['business:library:platform:firm:list:admin']">
              分配管理员
            </a-button>
            <a-button type="link" @click="handleOpen({ type: EDIT, id: record.companyId })" v-hiddenS="['business:library:platform:firm:list:edit']">
              编辑
            </a-button>
            <DeleteButton v-bind="{ ...deleteButtonProps(record) }" v-hiddenS="['business:library:platform:firm:list:delete']"></DeleteButton>
          </ActionButtonCol>
        </template>
      </template>
    </ProTable>
    <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
    <Admin v-bind="{ ...unref(adminState), close: adminClose }" v-if="adminState.visible"></Admin>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted } from 'vue';
import { CREATE, EDIT, DETAIL } from '@/utils/const';
import { companyList, companyDelete } from '@/api/business/company';
import { getDictDataValue } from '@/api/system/dict';
import { filterEnum, isObject, isNull, deleteCallBack } from '@/utils/utils';
import { dateFormat } from '@/utils/day';
import Edit from './edit.vue';
import Admin from './admin/list';
import _ from 'lodash';

// 编辑、新增 弹窗
const state = reactive({
  type: '',
  id: null,
  visible: false
});

const adminState = reactive({
  companyId: null,
  visible: false
});

const proTableRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const natureEnum = ref([]);

onMounted(async () => {
  try {
    const natureData = await getDictDataValue({ dictType: 'business_nature' });
    natureEnum.value = natureData?.data || [];
  } catch (error) {
    console.error('firm-list-onMounted', error);
  }
});

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

const handleOpenAdmin = ({ companyId }) => {
  adminState.visible = true;
  adminState.companyId = companyId;
};

const adminClose = () => {
  adminState.visible = false;
};

const deleteButtonProps = (record) => {
  const length = record?.children?.length;
  const { companyName, companyId } = record || {};
  return {
    title: `您确定删除“${companyName}”企业吗?`,
    content: `确定删除后，系统将不存在此企业`,
    deleteRequest: () => handleDelete(companyId)
  };
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (id) => {
  try {
    const companyIds = !isNull(id) ? (!Array.isArray(id) ? [id] : id) : [];
    const result = await companyDelete({ companyId: id });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('firm-list-handleDelete', error);
  }
};

// 表单配置
const formConfig = () => {
  return [
    {
      value: 'companyName',
      el: 'input',
      props: {
        placeholder: '企业名称'
      }
    },
    {
      value: 'nature',
      el: 'select',
      props: {
        options: natureEnum.value,
        optionFilterProp: 'dictLabel',
        allowClear: true,
        showSearch: true,
        fieldNames: { label: 'dictLabel', value: 'dictValue' },
        placeholder: '企业性质'
      }
    },
    {
      value: 'contactPerson',
      el: 'input',
      props: {
        placeholder: '企业联系人'
      }
    }
  ];
};

// table配置
const columns = () => {
  return [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      customRender: ({ text, record }) => {
        return (
          <a
            class='table-custom-primary'
            v-disabledS={['business:library:platform:firm:list:detail']}
            onClick={() => handleOpen({ type: DETAIL, id: record.companyId })}
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
      title: '企业性质',
      dataIndex: 'nature',
      customRender({ text }) {
        return filterEnum(text, natureEnum.value, { label: 'dictLabel', value: 'dictValue' });
      },
      ellipsis: true,
      width: 210
    },
    {
      title: '企业联系人',
      dataIndex: 'contactPerson',
      ellipsis: true,
      width: 100
    },
    {
      title: '联系人电话',
      dataIndex: 'contactPhone',
      ellipsis: true,
      width: 210
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      customRender: function ({ text }) {
        return dateFormat(text);
      },
      width: 120
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
