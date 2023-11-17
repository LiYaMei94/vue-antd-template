<template>
  <div class="list-table-content">
    <ProTable ref="proTableRef" v-bind="{ formConfig, columns, requestApi: systemDictList, rowKey: 'dictId' }">
      <template #tableHeaderLeft>
        <div class="table-name">数据字典</div>
      </template>
      <template #toolButton>
        <AddButton v-bind="{ onClick: () => handleOpen({ type: CREATE }) }"></AddButton>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { column, record, text, index } }">
        <template v-if="column?.dataIndex === 'status'">
          <StatusSwitch v-bind="{ auth: ['system:config:dict:status'], text, handleStatusChange, params: { record, index } }"></StatusSwitch>
        </template>
        <template v-if="column?.dataIndex === 'action'">
          <ActionButtonCol>
            <a-button type="link" @click="handleOpenDictData({ type: EDIT, id: record?.dictId })">数据值维护</a-button>
            <a-button type="link" @click="handleOpen({ type: EDIT, id: record.dictId })">编辑</a-button>
            <DeleteButton
              v-bind="{
                ...deleteButtonProps(record)
              }"
            ></DeleteButton>
          </ActionButtonCol>
        </template>
      </template>
    </ProTable>
    <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
    <DataEdit v-bind="{ ...unref(dictDataState), closeDictData }" v-if="dictDataState.type"></DataEdit>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted } from 'vue';
import Edit from './edit.vue';
import DataEdit from './dictValue/list.vue';
import { CREATE, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, CONST_STRING_0, CONST_STRING_1 } from '@/utils/const';
import { systemDictList, systemDictDelete, systemDictUpdate } from '@/api/system/dict';
import { useStore } from 'vuex';
import { filterEnum, isNull, deleteCallBack } from '@/utils/utils';
import { dateFormat } from '@/utils/day';

const { state: storeState } = useStore();

// 数据字典编辑、新增 弹窗
const state = reactive({
  type: '',
  id: null,
  visible: false // 添加、新增字典弹窗
});

// 字典内容编辑、新增 弹窗
const dictDataState = reactive({
  type: '',
  id: null,
  visible: false // 字典数据弹窗
});

const proTableRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const updateRowData = computed(() => proTableRef.value?.updateRowData); // 刷新指定行数据

// 打开数据字典内容弹窗
const handleOpenDictData = ({ type, id }) => {
  dictDataState.visible = true;
  dictDataState.id = id;
  dictDataState.type = 'type';
};

// 打开数据字典弹窗
const handleOpen = ({ type, id }) => {
  state.visible = true;
  state.id = id;
  state.type = type;
};

// 关闭数据字典弹窗
const close = (refresh = false) => {
  state.visible = false;
  state.type = '';
  refresh && search.value && search.value();
};

// 关闭数据字典内容弹窗
const closeDictData = (refresh = false) => {
  dictDataState.visible = false;
  dictDataState.type = '';
  search.value && search.value();
};

const deleteButtonProps = (record) => {
  const { dictName, dictId } = record || {};
  return {
    title: `您确定删除“${dictName}”数据字典吗?`,
    content: `确定删除后，系统将不存在此数据字典`,
    deleteRequest: () => handleDelete(dictId)
  };
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (id) => {
  try {
    const dictIds = !isNull(id) ? (!Array.isArray(id) ? [id] : id) : [];
    const result = await systemDictDelete({ dictIds: dictIds.join(',') });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('dict-list-handleDelete', error);
  }
};

const handleStatusChange = async (options) => {
  try {
    const { event, record, index } = options || {};
    const status = event ? CONST_STRING_1 : CONST_STRING_0;
    await systemDictUpdate({ ...record, status });
    updateRowData.value && updateRowData.value({ ...record, status }, index);
  } catch (error) {
    console.error('dict-list-handleStatusChange', error);
  }
};

// 表单配置
const formConfig = [
  {
    label: '字典名称',
    value: 'dictName',
    el: 'input'
  },
  {
    label: '字典标识',
    value: 'dictType',
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
  }
];

// table配置
const columns = [
  // {
  //   title: '序号',
  //   dataIndex: 'number',
  //   width: 100,
  //   customRender({ text, record, index, column }) {
  //     return index + 1;
  //   }
  // },
  {
    title: '字典名称',
    dataIndex: 'dictName',
    ellipsis: true,
    customRender: ({ text, record }) => {
      return (
        <a class='table-custom-primary' onClick={() => handleOpen({ type: DETAIL, id: record.dictId })}>
          {text}
        </a>
      );
    }
  },
  {
    title: '字典标识',
    dataIndex: 'dictType',
    ellipsis: true
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '数据值数量',
    dataIndex: 'dictDataNumber',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customRender: function ({ text }) {
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
    width: 200,
    fixed: 'right',
    disabled: true
  }
];
</script>
