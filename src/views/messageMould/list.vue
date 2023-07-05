<template>
  <div class="list-table-content">
    <ProTable ref="proTableRef" v-bind="{ formConfig, columns, requestApi: mouldList, rowKey: 'id', labelCol: { span: 7 } }">
      <template #tableHeaderLeft>
        <a-button type="primary" @click="handleOpen({ type: CREATE })">添加</a-button>
      </template>
      <template v-slot:bodyCell="{ dataInfo: { column, record, text } }">
        <template v-if="column.dataIndex === 'id'">
          <a class="table-custom-primary" @click="handleOpen({ type: DETAIL, id: record.id })">{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <span class="table-custom-cell">
            <a class="table-custom-primary" @click="handleOpen({ type: EDIT, id: record.id })">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认要删除吗？" @confirm="handleDelete(record.id)">
              <a class="table-custom-danger">删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </ProTable>
  </div>
</template>
<script setup>
import { ref, reactive, toRefs, unref, computed, watch, onMounted } from 'vue';
import ProTable from '@/components/ProTable';
import { CREATE, EDIT, DETAIL, TEMPLATE_STATUS_TYPE_ENUM, PAGE_ROUTE_NAME_MAP } from '@/utils/const';
import { mouldList, mouldDelete } from '@/apis/mould';
import { useStore } from 'vuex';
import { filterEnum } from '@/utils/utils';
import { useRouter } from 'vue-router';

const router = useRouter();
const { state: storeState } = useStore();
const channelTypeEnum = computed(() => storeState?.global?.allEnum?.channelType);
const idTypeEnum = computed(() => storeState?.global?.allEnum?.idType);
const msgTypeEnum = computed(() => storeState?.global?.allEnum?.messageType);
const templateStatusEnum = computed(() => storeState?.global?.allEnum?.messageTemplateStatus);

const state = reactive({
  type: '',
  id: null,
  visible: false
});

const handleOpen = ({ type, id }) => {
  const name = PAGE_ROUTE_NAME_MAP[type];
  router.push({ name: `MessageMould${name}`, params: { id, type } });
};

const proTableRef = ref();
const search = computed(() => unref(proTableRef.value?.search));

// 删除并刷新列表
const handleDelete = async (id) => {
  try {
    await mouldDelete({ id });
    search.value && search.value();
  } catch (error) {}
};

// 表单配置
const formConfig = [
  {
    label: '模板名称',
    value: 'name',
    el: 'input'
  },
  {
    label: '接收账号类型',
    value: 'idType',
    el: 'select',
    props: {
      options: idTypeEnum.value,
      fieldNames: { label: 'desc', value: 'id' },
      showSearch: true,
      optionFilterProp: 'desc'
    }
  },
  {
    label: '消息类型',
    value: 'msgType',
    el: 'select',
    props: {
      options: msgTypeEnum.value,
      fieldNames: { label: 'desc', value: 'id' },
      showSearch: true,
      optionFilterProp: 'desc'
    }
  },
  {
    label: '开启状态',
    value: 'templateStatus',
    el: 'select',
    props: {
      options: templateStatusEnum.value,
      fieldNames: { label: 'desc', value: 'id' },
      showSearch: true,
      optionFilterProp: 'desc'
    }
  },
  {
    label: '发布渠道',
    value: 'sendChannel',
    el: 'select',
    props: {
      options: channelTypeEnum.value,
      fieldNames: { label: 'desc', value: 'id' },
      showSearch: true,
      optionFilterProp: 'desc'
    }
  }
];

// table配置
const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    customRender({ text, record, index, column }) {
      return index + 1;
    },
    width: 80
  },
  {
    title: '模板编码',
    dataIndex: 'id'
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '接收账号类型',
    dataIndex: 'idType',
    customRender({ text }) {
      return filterEnum(text, idTypeEnum.value, { value: 'id', label: 'desc' });
    }
  },
  {
    title: '消息类型',
    dataIndex: 'msgType',
    customRender({ text }) {
      return filterEnum(text, msgTypeEnum.value, { value: 'id', label: 'desc' });
    }
  },
  {
    title: '模板类型',
    dataIndex: 'templateType',
    customRender({ text }) {
      return filterEnum(text, TEMPLATE_STATUS_TYPE_ENUM);
    },
    width: 80
  },
  {
    title: '发布渠道',
    dataIndex: 'sendChannel',
    customRender({ text }) {
      return filterEnum(text, channelTypeEnum.value, { value: 'id', label: 'desc' });
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true
  },
  {
    title: '开启状态',
    dataIndex: 'templateStatus',
    customRender({ text }) {
      return filterEnum(text, templateStatusEnum.value, { value: 'id', label: 'desc' });
    },
    width: 90
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 90
  }
];
</script>
