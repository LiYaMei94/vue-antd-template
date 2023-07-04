<template>
  <a-form
    ref="formRef"
    :model="formState"
    :labelCol="{ span: spanSizeConfig.formLabelColSpan }"
    :class="{ 'form-all-disable': isDetail ? true : false }"
  >
    <a-row>
      <a-col :span="spanSizeConfig.colSpan12">
        <a-form-item label="小程序模板" name="templateId" :rules="[{ required: true, message: '请选择小程序模板' }]">
          <a-select
            placeholder="请选择小程序模板"
            v-bind="{ options: templateCategoryEnum, showSearch: true, optionFilterProp: 'label' }"
            v-model:value="formState.templateId"
            @change="handleTemplateChange"
          ></a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row style="margin-bottom: 10px">
      <a-col :span="3"></a-col>
      <a-col :span="21">
        <EditTableCol ref="editTableColRef" v-bind="{ editColumns, columns, dataSource, rowKey: 'name', tableAddRow: false }">
          <template v-slot:headerCell="{ dataInfo: { column } }">
            <template v-if="column.dataIndex === 'value'">
              {{ column.title }}
              <a-tooltip>
                <template #title>示例：{$title}</template>
                <MyIcon type="icon-question-circle"></MyIcon>
              </a-tooltip>
            </template>
          </template>
        </EditTableCol>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="spanSizeConfig.colSpan24">
        <a-form-item
          :labelCol="{ span: spanSizeConfig.colSpan24LabelCol }"
          label="跳转链接"
          name="pageUrl"
          :rules="[{ required: true, message: '请选择跳转链接' }]"
        >
          <a-textarea placeholder="请输入跳转链接" v-model:value="formState.pageUrl"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { isNull } from '@/utils/utils';
import { miniTempList, miniTempDetail } from '@/apis/mould';
import EditTableCol from '@/components/EditTable/EditCol';
import _ from 'lodash';

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
  },
  isCreate: {
    type: Boolean,
    default: false
  }
});

const editTableColRef = ref(null);
const formRef = ref(null);
const formState = ref({
  templateId: null,
  pageUrl: null
});
const templateCategoryEnum = ref([]);
const dataSource = ref([]);

// 编辑之后的表格值
const editTableData = computed(() => editTableColRef.value.dataSource);
const preJsonContent = ref('');
const editColumns = ['value'];
const columns = [
  {
    title: '参数名称',
    dataIndex: 'name'
  },
  {
    title: '变量',
    dataIndex: 'value'
  },
  {
    title: '描述',
    dataIndex: 'label'
  }
];

// 账号id改变，变量改变
watch(
  () => props.channelAccountId,
  async (val) => {
    if (isNull(val)) {
      formState.value = {
        ...formState.value,
        templateId: null
      };
      dataSource.value = [];
      templateCategoryEnum.value = [];
      return;
    }
    try {
      const result = await miniTempList({ id: props.channelAccountId });
      templateCategoryEnum.value = result?.data || [];
    } catch (error) {}
  }
);

// 选择小程序模板
const handleTemplateChange = async () => {
  try {
    const result = await miniTempDetail({ id: props.channelAccountId, wxTemplateId: formState.value.templateId });
    dataSource.value = result?.data?.columns;
  } catch (error) {}
};

// 父级组件提交数据是执行
const handleSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    const tableData = _.map(editTableData.value, (item) => {
      return { name: item.name, value: item.value, label: item.label };
    });
    return {
      ...formData,
      templateVariables: null,
      msgContent: JSON.stringify({
        page: formData?.pageUrl,
        templateId: formData?.templateId,
        miniProgramParam: tableData
      })
    };
  } catch (error) {
    console.log('error==', error);
    return Promise.reject(error);
  }
};

// 详情、编辑回填
const handleSetFields = (value) => {
  const { msgContent } = value || {};
  const content = !isNull(msgContent) && JSON.parse(msgContent);
  formState.value = {
    pageUrl: content?.page,
    templateId: content?.templateId
  };
  dataSource.value = content?.miniProgramParam;
};
onMounted(() => {
  !props.isCreate && handleSetFields(props.basicData);
});

defineExpose({ handleSubmit });
</script>

<style lang="less" scoped>
.tip-container {
  margin: 5px 0;
}
</style>
