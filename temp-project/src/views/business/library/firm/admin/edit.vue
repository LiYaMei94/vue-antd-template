<template>
  <CustomDrawer
    :width="850"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false), isDetail }"
  >
    <PersonnelMaintain ref="personnelMaintainRef" v-bind="{ deleteFileAnnex, otherParams: defaultParams }"></PersonnelMaintain>
  </CustomDrawer>
</template>
<script lang="jsx" setup>
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL } from '@/utils/const';
import PersonnelMaintain from '@/components/BusinessComponents/PersonnelMaintain';
import { personnelCreate, deleteFileAnnex } from '@/api/business/personnel';

const validateFields = computed(() => personnelMaintainRef.value?.validateFields);
const extendUserList = computed(() => personnelMaintainRef.value?.annexFileList);
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
  companyId: {
    type: [String, Number]
  }
});

const personnelMaintainRef = ref(null);
const defaultParams = ref({ companyId: props.companyId, userType: '1' });
const formState = computed(() => personnelMaintainRef.value?.formState);
const title = `${PAGE_TITLE_MAP[props.type]}管理员`;
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
      ...formData,
      ...defaultParams.value,
      extendUserList: extendUserFileList
    };
    await personnelCreate({ ...params });
    handleClose(true);
  } catch (error) {
    console.error('firm-admin-create-onSubmit', error);
  }
};
</script>

<style lang="less" scoped></style>
