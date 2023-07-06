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
              <a-table
                ref="editTemplateVariablesRef"
                v-bind="{
                  columns,
                  dataSource: tableData,
                  rowKey: 'id',
                  customRow: tableRowClick
                }"
                bordered
                :pagination="false"
              >
                <template #headerCell="{ column }">
                  <template v-if="column.dataIndex === 'name'">
                    {{ column.title }}
                    <a-tooltip>
                      <template #title>示例：{$title}</template>
                      <MyIcon type="icon-question-circle"></MyIcon>
                    </a-tooltip>
                  </template>
                </template>
                <template #bodyCell="{ column, index, record }">
                  <template v-if="column.dataIndex === 'action'">
                    <span class="table-custom-cell">
                      <DoubleRightOutlined
                        style="margin-right: 10px"
                        @click="handleInsertText(record)"
                        class="table-custom-primary"
                      ></DoubleRightOutlined>
                      <DeleteOutlined @click="handleDelete(index)" style="margin-right: 10px" class="table-custom-danger"></DeleteOutlined>
                      <EditOutlined @click="handleEdit(record, index)" class="table-custom-primary"></EditOutlined>
                    </span>
                  </template>
                </template>
              </a-table>
              <div class="table-add">
                <a-button type="link" @click="modalVisible = !modalVisible">+ 添加参数</a-button>
                <slot name="tableAdd"></slot>
              </div>
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
    <a-modal :visible="modalVisible" title="添加参数" @ok="handleOk" @cancel="handleCancel">
      <a-form ref="modalFormRef" :model="modalFormState" :labelCol="{ span: 4 }">
        <a-form-item name="name" label="参数名称" :rules="[{ required: true, message: '请输入参数名称' }]">
          <a-input v-model:value.trim="modalFormState.name"></a-input>
        </a-form-item>
        <a-form-item name="description" label="描述" :rules="[{ required: true, message: '请输入参数说明' }]">
          <a-input v-model:value.trim="modalFormState.description"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed, toRef, onMounted } from 'vue';
import WangEditor from '@/components/WangEditor';
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
const formState = ref({});
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
    width: 95
  }
];

// 弹窗
const modalFormRef = ref(null);
const modalFormState = ref({
  name: '',
  description: ''
});
const modalVisible = ref(false);
let isModalEdit = false;
let currentIndex = null;
const handleCancel = () => {
  modalVisible.value = false;
  modalFormState.value = {};
  modalFormRef.value?.resetFields();
  isModalEdit = false;
  currentIndex = null;
};

const handleOk = async () => {
  try {
    await modalFormRef.value?.validateFields();
    if (!isModalEdit) {
      tableData.value.push({ ...unref(modalFormState) });
    } else {
      const tableInfo = _.cloneDeep(tableData.value);
      tableInfo.splice(currentIndex, 1, { ...unref(modalFormState) });
      tableData.value = tableInfo;
    }
    handleCancel();
  } catch (error) {}
};

// 表格删除行
const handleDelete = (index) => {
  const tableInfo = _.cloneDeep(tableData.value);
  tableInfo.splice(index, 1);
  tableData.value = tableInfo;
};

// 表格行编辑
const handleEdit = (record, index) => {
  modalVisible.value = true;
  isModalEdit = true;
  currentIndex = index;
  modalFormState.value = _.cloneDeep(record);
};

// 双击表格行将参数写入富文本编辑器内
const tableRowClick = (record) => {
  return {
    onDblclick: () => {
      // insertText.value && insertText.value(`${record?.name}`);
    },
    onClick: () => {
      insertText.value && insertText.value(`${record?.name}`);
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
    const tableInfo = _.map(tableData.value, (item) => {
      return { name: item.name, description: item.description, id: item?.id, templateId: item?.templateId };
    });

    if (tableInfo.length === 0) {
      message.error('请编写模板参数');
      return Promise.reject('请编写模板参数');
    }
    return {
      ...formData,
      templateVariables: tableInfo,
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
    border: 1px dashed var(--ant-line-color);
    padding: 15px;
    box-sizing: border-box;
  }
  .table-add {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid var(--ant-line-color);
  }
}
</style>
