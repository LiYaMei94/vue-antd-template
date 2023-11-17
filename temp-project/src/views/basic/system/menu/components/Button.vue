<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="buttonRules"
    :labelCol="{ span: 4 }"
    :class="{ 'form-all-disable': isDetail ? true : false }"
    class="menu-edit"
    autocomplete="off"
  >
    <a-form-item label="所属模块" name="parentId">
      <a-tree-select
        placeholder="请选择所属模块"
        v-model:value="formState.parentId"
        :treeData="parentMenu"
        tree-node-filter-prop="name"
        show-search
        :fieldNames="{ children: 'children', label: 'name', value: 'id' }"
        tree-default-expand-all
      ></a-tree-select>
    </a-form-item>
    <a-form-item name="perms">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.perms, label: '权限标识' }"></QuestionTooltip>
      </template>
      <a-input placeholder="请输入权限标识" v-model:value="formState.perms" :show-count="!isDetail" :maxlength="200"></a-input>
    </a-form-item>
  </a-form>
</template>
<script setup>
import { ref, defineExpose, watch, watchEffect } from 'vue';
import { buttonRules } from '../js/editRules';
import _ from 'lodash';
import { formItemTip, updateFormData } from '../js';

const props = defineProps({
  isDetail: {
    type: Boolean,
    default: false
  },
  defaultData: {
    type: Object,
    default: {}
  },
  menuType: {
    type: String,
    default: null
  },
  parentMenu: {
    type: Object,
    default: []
  }
});

const formRef = ref();
const formState = ref({});

watch(
  () => props.defaultData,
  (newVal, oldVal) => {
    if (!_.isEqual(newVal, oldVal)) {
      formState.value = { ...newVal };
    }
  },
  { deep: true, immediate: true }
);

// watchEffect(() => {
//   const info = updateFormData(props.parentMenu, formState.value);
//   formState.value.permsBefore = info?.permsBefore || '';
//   formState.value.permsValue = info?.permsValue || '';
// });

const handleSubmit = () => {
  try {
    const params = { ...formState.value, spreadParameter: '', icon: '' };
    return params;
  } catch (error) {
    console.error('menu-Button-handleSubmit', error);
    return Promise.reject(error);
  }
};

const handleValidate = async () => {
  try {
    await formRef.value?.validateFields();
  } catch (error) {
    console.error('menu-Button-handleValidate', error);
    return Promise.reject(error);
  }
};

defineExpose({ handleSubmit, handleValidate });
</script>
