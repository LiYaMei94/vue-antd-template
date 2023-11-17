<template>
  <div class="list-table-content">
    <ProTable
      ref="proTableRef"
      v-bind="{
        formConfig,
        columns,
        requestApi: systemMenuList,
        rowKey: 'menuId',
        tableConfig: { expandedRowKeys },
        firstRequestAuto: false
      }"
    >
      <template #tableHeaderLeft>
        <div class="table-name">入驻企业</div>
      </template>
      <template #toolButton>
        <AddButton v-bind="{ onClick: () => handleOpen({ type: CREATE }) }" v-if="isDevelopment"></AddButton>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { column, record } }">
        <template v-if="column?.dataIndex === 'action' && isDevelopment && record?.menuType !== MENU_TYPE_R">
          <ActionButtonCol>
            <a-button type="link" @click="handleOpen({ type: EDIT, id: record.menuId })">编辑</a-button>
            <DeleteButton v-bind="{ ...deleteButtonProps(record) }"></DeleteButton>
          </ActionButtonCol>
        </template>
      </template>
    </ProTable>
    <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
  </div>
</template>
<script setup lang="jsx">
import { ref, reactive, toRefs, unref, computed, watch, onMounted } from 'vue';
import Edit from './edit.vue';
import { CREATE, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, MENU_TYPE_MAP, YES_OR_NO, MENU_HIDDEN_TYPE, MENU_TYPE_R } from '@/utils/const';
import { systemMenuList, systemMenuDelete } from '@/api/system/menu';
import { filterEnum, isObject, getExpandedTreeByNumber, isNull, deleteCallBack } from '@/utils/utils';
import { dateFormat } from '@/utils/day';
import _ from 'lodash';

// 菜单编辑、新增 弹窗
const state = reactive({
  type: '',
  id: null,
  visible: false
});

const proTableRef = ref();
const search = computed(() => proTableRef.value?.getTableData); // 刷新整理表格数据
const expandedRowKeys = ref([]);
const tableData = ref([]);
const isDevelopment = process.env?.NODE_ENV === 'development';

onMounted(async () => {
  try {
    const searchData = await (search.value && search.value());
    tableData.value = searchData?.data;
    // 默认展开三级
    expandedRowKeys.value = getExpandedTreeByNumber(searchData?.data, 'menuId', 3);
  } catch (error) {
    console.error('menu-list-onMounted', error);
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

const deleteButtonProps = (record) => {
  const length = record?.children?.length;
  const { menuName, menuId } = record || {};
  return {
    title: `您确定删除“${menuName}”菜单吗?`,
    content: `确定删除后，系统将不存在此菜单`,
    deleteRequest: () => handleDelete(menuId)
  };
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (id) => {
  try {
    const menuIds = !isNull(id) ? (!Array.isArray(id) ? [id] : id) : [];
    const result = await systemMenuDelete({ menuId: id });
    deleteCallBack(result, '不能删除此数据').then((res) => search.value && search.value());
  } catch (error) {
    console.error('menu-list-handleDelete', error);
  }
};

// 表单配置
const formConfig = [
  {
    label: '菜单名称',
    value: 'menuName',
    el: 'input'
  },
  {
    label: '菜单类型',
    value: 'menuType',
    el: 'select',
    props: {
      options: MENU_TYPE_MAP,
      showSearch: true,
      optionFilterProp: 'label'
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
    title: '菜单名称',
    dataIndex: 'menuName',
    customRender: ({ text, record }) => {
      return record?.menuType !== MENU_TYPE_R ? (
        <a class='table-custom-primary' onClick={() => handleOpen({ type: DETAIL, id: record.menuId })}>
          {text}
        </a>
      ) : (
        <span>{text}</span>
      );
    },
    ellipsis: true,
    width: 210
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    customRender({ text }) {
      return filterEnum(text, [
        ...MENU_TYPE_MAP,
        {
          label: '模块',
          value: MENU_TYPE_R
        }
      ]);
    },
    ellipsis: true
  },
  {
    title: '排序',
    dataIndex: 'orderNum'
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
    ellipsis: true
  },
  {
    title: '是否外链',
    dataIndex: 'isFrame',
    customRender({ text, record }) {
      if (record?.menuType === MENU_TYPE_R) return '';
      return filterEnum(text, YES_OR_NO);
    },
    width: 80
  },
  {
    title: '路由地址',
    dataIndex: 'path',
    ellipsis: true
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    ellipsis: true,
    show: false
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    customRender({ text, record }) {
      const item = filterEnum(text, ENABLE_DISABLE_STATUS_ENUM, null, 'group');
      return isObject(item) ? <a-tag color={item?.color}>{item?.label}</a-tag> : text;
    },
    width: 100
  },
  {
    title: '显示状态',
    dataIndex: 'visible',
    customRender({ text, record }) {
      if (record?.menuType === MENU_TYPE_R) return '';
      const item = filterEnum(text, MENU_HIDDEN_TYPE, null, 'group');
      return isObject(item) ? <a-tag color={item?.color}>{item?.label}</a-tag> : text;
    },
    show: false,
    width: 100
  },
  {
    title: '图标',
    dataIndex: 'icon',
    ellipsis: true,
    show: true,
    customRender({ text, record }) {
      return !isNull(text) ? <IconFont type={text} source='anticonfont'></IconFont> : null;
    }
  },
  {
    title: '重定向路由',
    dataIndex: 'redirectPath',
    ellipsis: true,
    show: false
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    disabled: true,
    width: 120,
    show: true
  }
];
</script>
