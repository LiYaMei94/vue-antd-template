<template>
  <CustomDrawer :width="`${drawerContentWidth}px`" placement="right" :visible="visible">
    <div class="drawer-content">
      <div class="list-table-content">
        <ProTable
          ref="proTableRef"
          v-bind="{
            formConfig,
            columns,
            requestApi: systemDictDataList,
            rowKey: 'dictCode',
            rowDrag: true,
            dragChange,
            tableName: 'system-dict-data-list',
            firstRequestAuto: false,
            defaultSearchParams
          }"
        >
          <template #tableHeaderLeft>
            <div class="table-name">数据字典值</div>
          </template>
          <template #toolButton>
            <AddButton v-bind="{ onClick: () => handleOpen({ type: CREATE }) }"></AddButton>
          </template>
          <template v-slot:bodyCell="{ dataInfo: { column, record, text, index } }">
            <template v-if="column?.dataIndex === 'status'">
              <StatusSwitch v-bind="{ auth: ['system:config:dict:data:status'], text, handleStatusChange, params: { record, index } }"></StatusSwitch>
            </template>
            <template v-if="column?.dataIndex === 'action'">
              <ActionButtonCol>
                <a-button type="link" @click="handleOpen({ type: EDIT, id: record.dictCode })">编辑</a-button>
                <DeleteButton
                  v-bind="{
                    ...deleteButtonProps(record),
                    modalOptions: { title: '字典数值删除', content: `确定要删除【${record?.dictLabel}】吗？` },
                    deleteFun: () => handleDelete(record?.dictCode)
                  }"
                ></DeleteButton>
              </ActionButtonCol>
            </template>
          </template>
        </ProTable>
        <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
      </div>
    </div>
    <template #footer>
      <div class="ant-drawer-footer-custom">
        <a-button @click="closeDictData">关闭</a-button>
      </div>
    </template>
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted } from 'vue';
import Edit from './edit.vue';
import { CREATE, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, PAGE_TITLE_MAP, CONST_STRING_1, CONST_STRING_0 } from '@/utils/const';
import { systemDictDataList, systemDictDataDelete, systemDictDataUpdate, systemDictDataSort, systemDictDetail } from '@/api/system/dict';
import { useStore } from 'vuex';
import { filterEnum, isNull, deleteCallBack } from '@/utils/utils';
import { dateFormat } from '@/utils/day';

const { state: storeState } = useStore();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  closeDictData: {
    type: Function,
    default: null
  },
  type: {
    type: String,
    default: CREATE
  },
  id: {
    type: [String, Number]
  }
});

const state = reactive({
  type: '',
  id: null,
  visible: false,
  dictId: props.id
});

const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const title = `${PAGE_TITLE_MAP[props.type]}字典数据值`;

const proTableRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const updateRowData = computed(() => proTableRef.value?.updateRowData); // 刷新指定行数据
const dictDetail = ref({});
const defaultSearchParams = ref({});

const sideDom = document.getElementsByClassName('ant-layout-sider');
const sideDomWidth = sideDom && sideDom[0] ? sideDom[0].clientWidth : 200;
const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const drawerContentWidth = width - sideDomWidth;

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

const getDictDetail = async () => {
  try {
    const detail = await systemDictDetail({ dictId: props.id });
    defaultSearchParams.value = { dictType: detail?.data?.dictType };
    search.value && search.value({ dictType: detail?.data?.dictType });
  } catch (error) {
    console.error('dictData-list-getDictDetail', error);
  }
};
getDictDetail();

const deleteButtonProps = (record) => {
  const { dictLabel, dictCode } = record || {};
  return {
    title: `您确定删除“${dictLabel}”数据字典值吗?`,
    content: `确定删除后，系统将不存在此数据字典值`,
    deleteRequest: () => handleDelete(dictCode)
  };
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (id) => {
  try {
    const dictCodes = !isNull(id) ? (!Array.isArray(id) ? [id] : id) : [];
    const result = await systemDictDataDelete({ dictCodes: dictCodes.join(',') });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('dictData-list-handleDelete', error);
  }
};

// 更新状态
const handleStatusChange = async (options) => {
  try {
    const { event, record, index } = options || {};
    const status = event ? CONST_STRING_1 : CONST_STRING_0;
    await systemDictDataUpdate({ ...record, status });
    updateRowData.value && updateRowData.value({ ...record, status }, index);
  } catch (error) {
    console.error('dictData-list-handleStatusChange', error);
  }
};

// 排序
const dragChange = async (change1, change2) => {
  try {
    const data = [
      { ...change1, dictSort: change2?.dictSort },
      { ...change2, dictSort: change1.dictSort }
    ];
    await systemDictDataSort(data);
  } catch (error) {
    console.error('dictData-list-dragChange', error);
  }
};

// 表单配置
const formConfig = [
  {
    label: '字典标识',
    value: 'dictType',
    el: 'input',
    props: {
      disabled: true
    }
  },
  {
    label: '数据标签',
    value: 'dictLabel',
    el: 'input',
    props: {
      showCount: true,
      maxlength: 20
    }
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
  {
    title: '',
    dataIndex: 'number',
    customRender({ text, record, index, column }) {
      return <IconFont type='icon-drag'></IconFont>;
    },
    width: 40
  },
  {
    title: '数据键值',
    dataIndex: 'dictValue'
  },
  {
    title: '数据标签',
    dataIndex: 'dictLabel',
    ellipsis: true
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true
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
    title: '操作',
    dataIndex: 'action',
    width: 120,
    fixed: 'right',
    disabled: true
  }
];
</script>
