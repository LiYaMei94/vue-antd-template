<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="menuRules"
    :labelCol="{ span: 4 }"
    :class="{ 'form-all-disable': isDetail ? true : false }"
    class="menu-edit"
    autocomplete="off"
  >
    <a-form-item name="icon">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.icon, label: '菜单图标' }"></QuestionTooltip>
      </template>
      <a-input
        placeholder="请输入菜单图标。示例：【icon-question-circle或IconQuestionCircle】"
        v-model:value="formState.icon"
        :show-count="!isDetail"
        :maxlength="50"
      ></a-input>
    </a-form-item>
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
    <a-form-item name="isFrame">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.isFrame, label: '是否外链' }"></QuestionTooltip>
      </template>
      <a-radio-group v-model:value="formState.isFrame">
        <template v-for="item in YES_OR_NO" :key="item.value">
          <a-radio :value="item.value">{{ item.label }}</a-radio>
        </template>
      </a-radio-group>
    </a-form-item>
    <a-form-item name="pathValue">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.path, label: '路由地址' }"></QuestionTooltip>
      </template>
      <a-input
        placeholder="请输入路由地址。示例：【user】"
        v-model:value="formState.pathValue"
        :addon-before="formState.isFrame !== CONST_STRING_1 ? formState.pathBefore : null"
        :show-count="!isDetail"
        :maxlength="200"
      />
    </a-form-item>
    <a-form-item name="component">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.component, label: '组件路径' }"></QuestionTooltip>
      </template>
      <a-input
        placeholder="请输入组件路径"
        v-model:value="formState.component"
        addonBefore="@/views/"
        addonAfter=".vue"
        :show-count="!isDetail"
        :maxlength="200"
      ></a-input>
    </a-form-item>
    <a-form-item name="perms">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.perms, label: '权限标识' }"></QuestionTooltip>
      </template>
      <a-input placeholder="请输入权限标识" v-model:value="formState.perms" :show-count="!isDetail" :maxlength="200"></a-input>
    </a-form-item>
    <a-form-item name="visible">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.visible, label: '显示状态' }"></QuestionTooltip>
      </template>
      <a-radio-group v-model:value="formState.visible">
        <template v-for="item in MENU_HIDDEN_TYPE" :key="item.value">
          <a-radio :value="item.value">{{ item.label }}</a-radio>
        </template>
      </a-radio-group>
    </a-form-item>
    <a-form-item name="pageLayout">
      <template #label>
        <QuestionTooltip v-bind="{ title: formItemTip?.pageLayout, label: '页面布局' }"></QuestionTooltip>
      </template>
      <PageLayoutSelect
        :handleClick="(value) => (formState.pageLayout = value)"
        :selectID="formState.pageLayout"
        :disabled="isDetail"
      ></PageLayoutSelect>
    </a-form-item>
    <a-form-item label="扩展参数" name="spreadParameter">
      <a-textarea :rows="4" placeholder="请输入扩展参数" v-model:value="formState.spreadParameter"></a-textarea>
    </a-form-item>
  </a-form>
</template>
<script setup>
import { ref, defineExpose, watch, computed, onMounted, watchEffect } from 'vue';
import { menuRules } from '../js/editRules';
import { YES_OR_NO, CONST_STRING_1, MENU_HIDDEN_TYPE } from '@/utils/const';
import { isNull } from '@/utils/utils';
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
      formState.value = {
        ...newVal,
        spreadParameter: isNull(newVal?.spreadParameter) ? '' : JSON.stringify(newVal?.spreadParameter)
      };
    }
  },
  { deep: true, immediate: true }
);

watchEffect(() => {
  const info = updateFormData(props.parentMenu, formState.value);
  // formState.value.permsBefore = info?.permsBefore || '';
  // formState.value.permsValue = info?.permsValue || '';
  formState.value.pathBefore = info?.pathBefore || '';
  formState.value.pathValue = info?.pathValue || '';
});

const handleSubmit = () => {
  try {
    const params = {
      ...formState.value,
      spreadParameter: isNull(formState.value) ? decodeURIComponent(encodeURIComponent(formState.value)) : '',
      // perms: `${formState.value.permsBefore}${formState.value.permsValue}`,
      path: `${formState.value.pathBefore}${formState.value.pathValue}`
    };
    return params;
  } catch (error) {
    console.error('menu-Menu-handleSubmit', error);
    return Promise.reject(error);
  }
};

const handleValidate = async () => {
  try {
    await formRef.value?.validateFields();
  } catch (error) {
    console.error('menu-Menu-handleValidate', error);
    return Promise.reject(error);
  }
};

defineExpose({ handleSubmit, handleValidate });
</script>
