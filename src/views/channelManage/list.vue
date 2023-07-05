<template>
  <div class="list-table-content">
    <ProTable ref="proTableRef" v-bind="{ formConfig, columns, requestApi: channelList, rowKey: 'id' }">
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
    <Edit v-bind="{ ...unref(state), close }" v-if="state.type"></Edit>
  </div>
</template>
<script setup>
import { ref, reactive, toRefs, unref, computed, watch, onMounted } from 'vue';
import ProTable from '@/components/ProTable';
import Edit from './edit.vue';
import { CREATE, EDIT, DETAIL } from '@/utils/const';
import { channelList, channelDelete } from '@/apis/channel';
import { useStore } from 'vuex';
import { filterEnum } from '@/utils/utils';

const { state: storeState } = useStore();
const channelTypeEnum = computed(() => storeState?.global?.allEnum?.channelType);

const state = reactive({
  type: '',
  id: null,
  visible: false
});

const handleOpen = ({ type, id }) => {
  state.visible = true;
  state.id = id;
  state.type = type;
};

const proTableRef = ref();
const search = computed(() => unref(proTableRef.value?.search));

const close = (refresh = false) => {
  state.visible = false;
  state.type = '';
  refresh && search.value && search.value();
};

// 删除并刷新列表
const handleDelete = async (id) => {
  try {
    await channelDelete({ id });
    search.value && search.value();
  } catch (error) {}
};

// 表单配置
const formConfig = [
  {
    label: '账号名称',
    value: 'name',
    el: 'input'
  },
  {
    label: '发送渠道',
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
    }
  },
  {
    title: '账号编码',
    dataIndex: 'id'
  },
  {
    title: '账号名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '发送渠道',
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
    title: '操作',
    dataIndex: 'action'
  }
];
</script>
