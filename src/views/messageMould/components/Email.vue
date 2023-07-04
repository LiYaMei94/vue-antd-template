<template>
  <div class="send-content-container">
    <a-row>
      <a-col :span="spanSizeConfig.colSpan24LabelCol">
        <div class="ant-col ant-form-item-label" style="width: 100%">
          <label for="form_item_sendChannel" class="ant-form-item-required" title="发送信息">发送信息</label>
        </div>
      </a-col>
      <a-col :span="21">
        <div class="send-content">
          <a-row>
            <a-col :span="10">
              <EditRow
                ref="editTableRowRef"
                v-bind="{
                  columns,
                  editColumns,
                  dataSource: tableData,
                  rowKey: 'id',
                  tableRowClick
                }"
              >
                <template v-slot:actionOther="{ dataInfo: { record, index } }">
                  <span class="table-custom-cell">
                    <DoubleRightOutlined
                      style="margin-right: 10px"
                      @click="handleInsertText(record)"
                      class="table-custom-primary"
                    ></DoubleRightOutlined>
                    <DeleteOutlined @click="handleDelete(index)" class="table-custom-danger"></DeleteOutlined>
                  </span>
                </template>
                <template v-slot:headerCell="{ dataInfo: { column } }">
                  <template v-if="column.dataIndex === 'name'">
                    {{ column.title }}
                    <a-tooltip>
                      <template #title>示例：{$title}</template>
                      <MyIcon type="icon-question-circle"></MyIcon>
                    </a-tooltip>
                  </template>
                </template>
              </EditRow>
            </a-col>
            <a-col :span="14" style="padding-left: 12px; box-sizing: border-box">
              <a-form ref="formRef" :model="formState" :labelCol="{ span: 4 }" :class="{ 'form-all-disable': isDetail ? true : false }">
                <a-form-item label="标题" name="emailTitle" :rules="[{ required: true, message: '请输入标题' }]">
                  <a-input v-model:value="formState.emailTitle" />
                </a-form-item>
                <a-form-item label="消息内容" name="editorContent" :rules="[{ validator: checkContent, trigger: 'change' }]">
                  <WangEditor width="100%" ref="WangEditorRef" :editorContent="WangEditorContent" :disable="isDetail"></WangEditor>
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed, toRef, onMounted } from 'vue';
import WangEditor from '@/components/WangEditor';
import EditRow from '@/components/EditTable/EditRow';
import { isNull } from '@/utils/utils';
import { message, Tooltip } from 'ant-design-vue';
import _ from 'lodash';
import MyIcon from '@/components/Icon.vue';

const props = defineProps({
  spanSizeConfig: {
    type: Object,
    default: {}
  },
  isDetail: {
    type: Boolean,
    default: false
  },
  basicData: {
    type: Object,
    default: {}
  },
  isCreate: {
    type: Boolean,
    default: false
  }
});

const WangEditorRef = ref(null);
const WangEditorContent = ref('');
const wangEditorHtml = computed(() => WangEditorRef?.value?.html);
const insertText = computed(() => WangEditorRef?.value?.handleInsertText);
const searchParam = ref({});
const formRef = ref(null);
const tableData = ref([]);
const editTableRowRef = ref(null);
const formState = ref({});
// 编辑之后的表格值
const editTableData = computed(() => editTableRowRef.value?.dataSource);
const editColumns = ['name', 'description'];
const columns = [
  {
    title: '参数名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 75
  }
];

// 表格删除行
const handleDelete = async (index) => {
  const tableInfo = _.cloneDeep(editTableData.value);
  tableInfo.splice(index, 1);
  tableData.value = tableInfo;
};

// 双击表格行将参数写入富文本编辑器内
const tableRowClick = (record, index) => {
  return {
    onDblclick: () => {
      // insertText.value && insertText.value(`${record?.name}`);
    }
  };
};

// 将当前行内容插入富文本编辑器
const handleInsertText = (record) => {
  insertText.value && insertText.value(`${record?.name}`);
};

// 校验html
let checkContent = async (_rule, value) => {
  if (!wangEditorHtml.value) {
    return Promise.reject('请输入邮件内容');
  } else {
    return Promise.resolve();
  }
};

// 父级组件提交数据是执行
const handleSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    const tableData = _.map(editTableData.value, (item) => {
      return { name: item.name, description: item.description, id: item?.id, templateId: item?.templateId };
    });

    if (tableData.length === 0) {
      message.error('请编写模板参数');
      return;
    }
    return {
      ...formData,
      templateVariables: tableData,
      msgContent: JSON.stringify({
        content: wangEditorHtml.value,
        title: formData?.emailTitle,
        url: ''
      })
    };
  } catch (error) {
    console.log('error==', error);
    return Promise.reject(error);
  }
};

// 详情、编辑回填
const handleSetFields = (value) => {
  const { msgContent, templateVariables } = value || {};
  const content = !isNull(msgContent) && JSON.parse(msgContent);
  formState.value = {
    emailTitle: content?.title
  };
  tableData.value = templateVariables;
  WangEditorContent.value = content?.content;
};

onMounted(() => {
  !props.isCreate && handleSetFields(props.basicData);
});

defineExpose({ handleSubmit });
</script>

<style lang="less" scoped>
.send-content-container {
  .send-content {
    border: 1px dashed var(--ant-line);
    padding: 15px;
    box-sizing: border-box;
  }
}
</style>
