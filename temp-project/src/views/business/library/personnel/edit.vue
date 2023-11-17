<template>
  <CustomDrawer
    :width="850"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false), isDetail }"
  >
    <PersonnelMaintain
      ref="personnelMaintainRef"
      v-bind="{
        defaultFormValue,
        deleteFileAnnex,
        type,
        otherParams: { ...defaultParams },
        deleteAuth: ['business:library:platform:personnel:file:delete']
      }"
      v-if="visible"
    ></PersonnelMaintain>
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL } from '@/utils/const';
import { personnelDetail, personnelCreate, personnelUpdate, deleteFileAnnex } from '@/api/business/personnel';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import PersonnelMaintain from '@/components/BusinessComponents/PersonnelMaintain/index.vue';
import { isObject, filterEnum, isNull } from '@/utils/utils';
import { rules } from './js/editRules';
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
  type: {
    type: String,
    default: CREATE
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
const personnelMaintainRef = ref(null);
const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const title = `${PAGE_TITLE_MAP[props.type]}组织人员`;
const defaultFormValue = ref({});
const formState = computed(() => personnelMaintainRef.value?.formState);
const validateFields = computed(() => personnelMaintainRef.value?.validateFields);
const extendUserList = computed(() => personnelMaintainRef.value?.annexFileList);

onMounted(async () => {
  try {
    !isCreate && props.id && (await getDetail());
  } catch (error) {
    console.error('firm-edit-onMounted', error);
  }
});

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await personnelDetail({ ...props.defaultParams, userId: props.id });
    defaultFormValue.value = { ...detail?.data } || {};
  } catch (error) {
    console.error('firm-edit-getDetail', error);
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
    const extendUserFileList =
      _.map(extendUserList.value, (item) => {
        return { fileId: item?.fileId, fileSize: item?.file?.size || item.size, fileName: item?.file?.name || item.name };
      }) || formData?.extendUserList;
    const params = {
      ...props.defaultParams,
      ...formData,
      extendUserList: extendUserFileList,
      userType: '0'
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
