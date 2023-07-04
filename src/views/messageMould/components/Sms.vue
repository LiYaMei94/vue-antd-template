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
                :dataSource="templateVariables"
                v-bind="{
                  columns: templateVariablesColumns,

                  rowKey: 'id'
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
              </a-table>
              <div class="table-add">
                <a-button type="link" @click="modalVisible = !modalVisible">+ 添加参数</a-button>
                <slot name="tableAdd"></slot>
              </div>
            </a-col>
            <a-col :span="14" style="padding-left: 12px; box-sizing: border-box">
              <a-form ref="formRef" :model="formState" :labelCol="{ span: 4 }" :class="{ 'form-all-disable': isDetail ? true : false }">
                <a-form-item label="模板编号" name="templateCode" :rules="[{ required: true, message: '请输入模板编号' }]">
                  <a-input v-model:value="formState.templateCode" />
                </a-form-item>
                <a-row>
                  <a-col :span="4"></a-col>
                  <a-col :span="20">
                    <EditRow
                      ref="editParamsTableRef"
                      v-bind="{
                        columns: paramsTableColumns,
                        editColumns: editParamsColumns,
                        dataSource: paramsTableDta,
                        rowKey: 'id'
                      }"
                    >
                      <template v-slot:actionOther="{ dataInfo: { index } }">
                        <span class="table-custom-cell">
                          <DeleteOutlined @click="handleDelete(index)" class="table-custom-danger"></DeleteOutlined>
                        </span>
                      </template>
                      <template v-slot:headerCell="{ dataInfo: { column } }">
                        <template v-if="column.dataIndex === 'variable'">
                          {{ column.title }}
                          <a-tooltip>
                            <template #title>内容在第三方平台维护，绑定第三方平台短信变量，如：腾讯云：{1}，阿里云格式：${name}</template>
                            <MyIcon type="icon-question-circle"></MyIcon>
                          </a-tooltip>
                        </template>
                      </template>
                      <template v-slot:bodyCell="{ dataInfo: { column, index, record } }">
                        <template v-if="column.dataIndex === 'variableName'">
                          <a-select
                            v-bind="{
                              options: templateVariables,
                              fieldNames: { label: 'name', value: 'name' },
                              showSearch: true,
                              optionFilterProp: 'name'
                            }"
                            @change="handleVariableNameChange($event, index)"
                            :value="record.variableName"
                            placeholder="输入内容"
                          ></a-select>
                        </template>
                      </template>
                    </EditRow>
                  </a-col>
                </a-row>
              </a-form>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <a-modal :visible="modalVisible" title="添加参数" @ok="handleOk" @cancel="handleCancel">
      <a-form ref="modalFormRef" :model="modalFormState">
        <a-form-item name="name" label="参数名称" :rules="[{ required: true, message: '请输入参数名称' }]">
          <a-input v-model:value.trim="modalFormState.name"></a-input>
        </a-form-item>
        <a-form-item name="description" label="参数说明" :rules="[{ required: true, message: '请输入参数说明' }]">
          <a-input v-model:value.trim="modalFormState.description"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const formRef = ref(null);
const formState = ref({});

// 模板变量
const modalFormRef = ref(null);
const modalFormState = ref({
  name: '',
  description: ''
});
const modalVisible = ref(false);
const templateVariables = ref([]);
const templateVariablesColumns = [
  {
    title: '参数名称',
    dataIndex: 'name'
  },
  {
    title: '参数说明',
    dataIndex: 'description'
  }
];
const handleCancel = () => {
  modalVisible.value = false;
  modalFormState.value = {};
  modalFormRef.value?.resetFields();
};
const handleOk = async () => {
  try {
    await modalFormRef.value?.validateFields();
    templateVariables.value.push({ ...unref(modalFormState) });
    handleCancel();
  } catch (error) {}
};

// 模板参数
const paramsTableDta = ref([]);
const editParamsTableRef = ref(null);
const editParamsTableData = computed(() => editParamsTableRef.value?.dataSource);
const editParamsColumns = ['variable', 'params'];
const paramsTableColumns = [
  {
    title: '序号',
    dataIndex: 'number',
    customRender({ text, record, index, column }) {
      return index + 1;
    }
  },
  {
    title: '短信变量',
    dataIndex: 'variable'
  },
  {
    title: '参数',
    dataIndex: 'variableName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 75
  }
];
const handleVariableNameChange = (value, index) => {
  editParamsTableData.value.splice(index, 1, { ...editParamsTableData.value[index], variableName: value });
};

// 父级组件提交数据是执行
const handleSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    const tableData = _.map(templateVariables.value, (item) => {
      return { name: item.name, description: item.description, id: item?.id, templateId: item?.templateId };
    });

    if (tableData.length === 0) {
      message.error('请编写模板参数');
      return;
    }

    // 参数变量数组转对象
    const newObj = {};
    _.forEach(editParamsTableData.value, (item) => {
      newObj[item?.variable] = item?.variableName;
    });

    return {
      ...formData,
      templateVariables: tableData,
      msgContent: JSON.stringify({
        templateCode: formData?.templateCode,
        smsParam: newObj,
        url: ''
      })
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

// 详情、编辑回填
const handleSetFields = (value) => {
  const { msgContent, templateVariables: tableData } = value || {};
  const content = !isNull(msgContent) && JSON.parse(msgContent);
  formState.value = {
    templateCode: content?.templateCode
  };

  const arr = [];
  for (const key in content?.smsParam) {
    console.log(key, content?.smsParam[key]);
    arr.push({
      variable: key,
      variableName: content?.smsParam[key]
    });
  }

  templateVariables.value = tableData;
  paramsTableDta.value = arr;
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
  .table-add {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid var(--ant-line);
  }
}
</style>
