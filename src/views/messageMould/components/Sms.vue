<template>
  <a-form
    ref="formRef"
    :model="formState"
    :labelCol="{ span: spanSizeConfig.formLabelColSpan }"
    :class="{ 'form-all-disable': isDetail ? true : false }"
  >
    <a-row>
      <a-col :span="spanSizeConfig.colSpan12">
        <a-form-item label="小程序模板2222222222" name="templateId" :rules="[{ required: true, message: '请选择小程序模板' }]">
          <a-select
            placeholder="请选择小程序模板"
            v-bind="{ options: templateCategoryEnum, fieldNames: { label: 'desc', value: 'id' }, showSearch: true, optionFilterProp: 'desc' }"
            v-model:value="formState.templateId"
          ></a-select>
        </a-form-item>
      </a-col>
      <a-col :span="spanSizeConfig.colSpan12">
        <a-form-item label="消息模板" name="messageTemplate" :rules="[{ required: true, message: '请选择消息模板' }]">
          <a-select placeholder="请选择消息模板" v-model:value="formState.messageTemplate"></a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="spanSizeConfig.colSpan24">
        <a-form-item
          :labelCol="{ span: spanSizeConfig.colSpan24LabelCol }"
          label="跳转链接"
          name="page"
          :rules="[{ required: true, message: '请选择跳转链接' }]"
        >
          <a-textarea placeholder="请输入跳转链接" v-model:value="formState.page"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  spanSizeConfig: {
    type: Object,
    default: {}
  },
  isDetail: {
    type: Boolean,
    default: false
  }
});

const formRef = ref(null);
const formState = ref({});
const templateCategoryEnum = ref([]);

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
