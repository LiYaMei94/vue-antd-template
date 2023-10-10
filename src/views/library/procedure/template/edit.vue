<template>
  <a-drawer :width="850" placement="right" :visible="visible" @close="handleClose(false)" :title="title">
    <CardHeaderTitle title="标准库信息"></CardHeaderTitle>
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 3 }" :class="{ 'form-all-disable': isDetail ? true : false }" :rules="rules">
      <a-form-item label="标准库名称" name="roleName">
        <a-input placeholder="请输入标准库名称" v-model:value="formState.roleName" :show-count="!isDetail" :maxlength="50"></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="ant-drawer-footer-custom">
        <a-button @click="handleClose(false)">{{ !isDetail ? '取消' : '关闭' }}</a-button>
        <a-button v-if="!isDetail" class="margin-left-10" type="primary" @click="onSubmit">提交</a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, CONST_STRING_0 } from '@/utils/const';
import { procedureTelDetail, procedureTelUpdate, procedureTelCreate } from '@/api/library/procedure';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import { isObject, filterEnum } from '@/utils/utils';
import { rules } from './config/rule';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: null
  },
  type: {
    type: String,
    default: CREATE
  },
  id: {
    type: [String, Number]
  }
});

const formRef = ref(null);
const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const title = `${PAGE_TITLE_MAP[props.type]}标准库`;
const formState = ref({});

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await procedureTelDetail({ roleId: props.id });
    formState.value = detail?.data || {};
  } catch (error) {
    console.error('library-procedure-template-edit-getDetail', error);
  }
};

onMounted(async () => {
  try {
    !isCreate && props.id && (await getDetail());
  } catch (error) {
    console.error('library-procedure-template-edit-onMounted', error);
  }
});

// 关闭抽屉
const handleClose = (refresh = false) => {
  props.close && props.close(refresh);
};

// 提交form表单
const onSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    const API = isCreate ? procedureTelCreate : procedureTelUpdate;
    await API({ ...formData });
    handleClose(true);
  } catch (error) {
    console.error('library-procedure-template-edit-onSubmit', error);
  }
};
</script>

<style lang="less" scoped></style>
