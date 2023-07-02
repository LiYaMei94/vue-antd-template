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
              <EditTableCol
                v-bind="{
                  columns,
                  editColumns,
                  handleSave: handleSaveEdit,
                  pagination: { ...config, ...page },
                  dataSource: tableData,
                  handleSizeChange,
                  rowKey: 'id'
                }"
              >
                <template v-slot:action="{ dataInfo: { record } }">
                  <span class="table-custom-cell">
                    <DeleteOutlined @click="handleDelete(record.id)"></DeleteOutlined>
                  </span>
                </template>
              </EditTableCol>
            </a-col>
            <a-col :span="14" style="padding-left: 12px; box-sizing: border-box">
              <a-form ref="formRef" :model="formState" :class="{ 'form-all-disable': isDetail ? true : false }">
                <a-form-item label="标题" name="emailTitle" :rules="[{ required: true, message: '请输入标题' }]">
                  <a-input v-model:value="formState.emailTitle" />
                </a-form-item>
              </a-form>
              <Tinymce v-model="tinymceContent" @change="handleTinymceChange" width="100%"></Tinymce>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { templateVariableList, templateVariableSave, templateVariableDelete } from '@/apis/mould';
import { useTable } from '@/hooks/useTable';
import EditTableCol from '@/components/EditTable/EditCol';
import Tinymce from '@/components/Tinymce';
import { isNull } from '@/utils/utils';

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
  channelAccountId: {
    type: [String, Number],
    default: null
  }
});

const tinymceContent = ref('');
const searchParam = ref({});
const { config, handleSizeChange, tableData, page, getTableData } =
  useTable({ searchParam, requestApi: templateVariableList, firstRequestAuto: false, hideOnSinglePage: true }) || {};
const formRef = ref(null);
const formState = ref({});
const templateCategoryEnum = ref([]);
const editColumns = ['name', 'description'];
const columns = [
  {
    title: '参数名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  }
];

// 账号id改变，变量改变
watch(
  () => props.channelAccountId,
  async (val) => {
    if (isNull(val)) {
      tableData.value = [];
      page.value = {
        ...page.value,
        total: 0,
        current: 0
      };
      return;
    }
    searchParam.value = { channelAccountId: val };
    getTableData && getTableData();
  }
);

// 表格删除行
const handleDelete = async (id) => {
  try {
    console.log('id--', id);
    // const result = await templateVariableDelete({});
    // getTableData && getTableData();
  } catch (error) {}
};

// 表格编辑保存
const handleSaveEdit = async (editableData) => {
  try {
    console.log('editableData', editableData);
    // const result = await templateVariableSave({});
  } catch (error) {}
};

const handleTinymceChange = (item) => {
  console.log('富文本编辑器', item);
};

// 父级组件提交数据是执行
const handleSubmit = async () => {
  console.log(2222);
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    return formData;
  } catch (error) {}
};

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
