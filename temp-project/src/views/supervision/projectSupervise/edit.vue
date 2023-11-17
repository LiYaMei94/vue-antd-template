<template>
  <CustomDrawer
    :width="850"
    placement="right"
    :visible="visible"
    title="设置职位/角色"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false) }"
  >
    角色职位
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { personnelDetail, personnelCreate, personnelUpdate, deleteFileAnnex } from '@/api/business/personnel';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import _ from 'lodash';

const components = {};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: null
  },
  id: {
    type: [String, Number]
  },
  defaultParams: {
    type: Object,
    default: null
  }
});

const formRef = ref(null);

onMounted(async () => {
  try {
    props.id && (await getDetail());
  } catch (error) {
    console.error('projectSupervise-edit-onMounted', error);
  }
});

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await personnelDetail({ ...props.defaultParams, userId: props.id });
  } catch (error) {
    console.error('projectSupervise-edit-getDetail', error);
  }
};

// 关闭抽屉
const handleClose = (refresh = false) => {
  props.close && props.close(refresh);
};

// 提交form表单
const onSubmit = async () => {
  try {
    validateFields.value && (await validateFields.value());
    const formData = unref(formState);
    const params = {
      ...props.defaultParams,
      ...formData
    };
    console.log('params', params);
    const API = isCreate ? personnelCreate : personnelUpdate;
    await API({ ...params });
    handleClose(true);
  } catch (error) {
    console.error('firm-edit-onSubmit', error);
  }
};
</script>

<style lang="less" scope></style>
