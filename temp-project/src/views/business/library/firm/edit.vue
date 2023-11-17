<template>
  <CustomDrawer
    :width="850"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false), isDetail }"
  >
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 4 }" :class="{ 'form-all-disable': isDetail ? true : false }" :rules="rules">
      <CardHeaderTitle title="基本信息"></CardHeaderTitle>
      <a-form-item label="企业名称" name="companyName">
        <a-input v-model:value="formState.companyName" allowClear :show-count="!isDetail" :maxlength="32" placeholder="请输入企业名称"></a-input>
      </a-form-item>
      <a-form-item label="企业性质" name="nature">
        <a-select
          v-model:value="formState.nature"
          allowClear
          showSearch
          :fieldNames="{ label: 'dictLabel', value: 'dictValue' }"
          optionFilterProp="dictLabel"
          placeholder="请选择企业性质"
          :options="natureEnum"
        ></a-select>
      </a-form-item>
      <a-form-item label="注册时间" name="registeredTime" placeholder="请选择注册时间">
        <a-date-picker v-model:value="formState.registeredTime" allowClear></a-date-picker>
      </a-form-item>
      <a-form-item label="所在地区">
        <a-form-item-rest><RegionSelect ref="regionSelectRef" :defaultValue="regionDefaultValue" :width="217" /></a-form-item-rest>
      </a-form-item>
      <a-form-item label="注册地址" name="registeredAddress">
        <a-input
          v-model:value="formState.registeredAddress"
          allowClear
          :show-count="!isDetail"
          :maxlength="100"
          placeholder="请输入注册地址"
        ></a-input>
      </a-form-item>
      <CardHeaderTitle title="企业负责人"></CardHeaderTitle>
      <a-form-item label="法定代表人" name="legalPersion">
        <a-input v-model:value="formState.legalPersion" allowClear :show-count="!isDetail" :maxlength="20" placeholder="请输入法定代表人"></a-input>
      </a-form-item>
      <a-form-item label="企业联系人" name="contactPerson">
        <a-input v-model:value="formState.contactPerson" allowClear :show-count="!isDetail" :maxlength="20" placeholder="请输入企业联系人"></a-input>
      </a-form-item>
      <a-form-item label="联系人电话" name="contactPhone">
        <a-input v-model:value="formState.contactPhone" allowClear :show-count="!isDetail" :maxlength="11" placeholder="请输入联系人电话"></a-input>
      </a-form-item>
      <CardHeaderTitle title="企业资料"></CardHeaderTitle>
      <a-form-item label="营业执照" name="businessLicense" v-bind="{ ...businessLicenseValidate }">
        <Upload
          ref="businessLicenseRef"
          v-bind="{
            disabled: isDetail,
            maxCount: 1,
            uploadRequest: uploadFusinessLicense,
            downloadRequest: fileDownload,
            size: 25,
            accept: '.jpg, .png, .jpeg',
            errorTip: 'border',
            listType: 'picture',
            defaultFileList: businessDefaultFileList
          }"
        />
      </a-form-item>
      <a-form-item label="统一信用编码" name="uniformCreditCode">
        <a-input
          v-model:value="formState.uniformCreditCode"
          allowClear
          :show-count="!isDetail"
          :maxlength="18"
          placeholder="请输入统一信用编码"
        ></a-input>
      </a-form-item>
      <CardHeaderTitle title="其他附件资料"></CardHeaderTitle>
      <a-row>
        <a-col :span="4"></a-col>
        <a-col :span="20">
          <Upload
            ref="annexRef"
            v-bind="{
              disabled: isDetail,
              maxCount: 5,
              uploadRequest: uploadAttachmentFile,
              downloadRequest: fileDownload,
              deleteFileRequest: deleteFileAnnex,
              size: 125,
              accept: '.jpg, .png, .jpeg, .pdf',
              errorTip: 'border',
              defaultFileList: annexDefaultFileList,
              uploadParams: { companyId: id },
              deleteAuth: ['business:library:platform:firm:list:attachment:delete']
            }"
          />
        </a-col>
      </a-row>
    </a-form>
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { companyDetail, companyCreate, companyUpdate, uploadFusinessLicense, deleteFileAnnex } from '@/api/business/company';
import { getDictDataValue } from '@/api/system/dict';
import { fileDownload, uploadAttachmentFile } from '@/api/file';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import RegionSelect from '@/components/RegionSelect';
import Upload from '@/components/Upload/index.vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL } from '@/utils/const';
import { isObject, filterEnum, isNull, blobPreviewFile } from '@/utils/utils';
import { getTime, getMomentDate } from '@/utils/day';
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
  }
});

const formRef = ref(null);
const regionSelectRef = ref(null);
const businessLicenseRef = ref(null);
const annexRef = ref(null);

const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const title = `${PAGE_TITLE_MAP[props.type]}入驻企业`;

const formState = ref({});
const regionDefaultValue = ref({});
const regionData = computed(() => regionSelectRef?.value?.regionData); // 省市区信息
const businessLicenseFileList = computed(() => businessLicenseRef?.value?.fileList); // 营业执照照片信息
const annexFileList = computed(() => annexRef?.value?.fileList); // 附件资料
const natureEnum = ref([]); // 营业性质枚举
const businessLicenseValidate = ref(null); // 自定义营业执照校验
const businessDefaultFileList = ref([]); // 营业执照回显
const annexDefaultFileList = ref([]); // 附件回显

watch(
  businessLicenseFileList,
  (val) => {
    const businessLicense = val && val[0]?.fileId;
    if (val.length) {
      if (!isNull(businessLicense)) {
        formState.value.businessLicense = businessLicense;
      }
      businessLicenseValidate.value = { 'validate-status': '', help: '' };
    }
  },
  { deep: true }
);

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await companyDetail({ companyId: props.id });
    formState.value = { ...detail?.data, registeredTime: getMomentDate(detail?.data?.registeredTime) } || {};
    const { businessLicense, province, city, area, registeredTime, companyAttachmentDTO } = detail?.data || {};
    // 省市区回填
    regionDefaultValue.value = { province, city, area };
    annexDefaultFileList.value = _.map(companyAttachmentDTO, (item) => {
      return { ...item, name: item?.fileName, size: item?.fileSize };
    });
    try {
      // 营业执照预览
      const businessLicenseStream = await fileDownload({ fileId: businessLicense });
      const fileInfo = await blobPreviewFile(businessLicenseStream?.file, businessLicenseStream?.fileName);
      businessDefaultFileList.value = [{ fileUrl: fileInfo?.url, name: fileInfo?.fileName, size: fileInfo?.fileSize, fileId: businessLicense }];
    } catch (error) {
      businessLicenseValidate.value = { 'validate-status': 'error', help: '营业执照预览失败' };
    }
  } catch (error) {
    console.error('firm-edit-getDetail', error);
  }
};

const getBusinessDefaultFileList = async () => {
  try {
  } catch (error) {}
};

onMounted(async () => {
  try {
    !isCreate && props.id && (await getDetail());
    const natureData = await getDictDataValue({ dictType: 'business_nature' });
    natureEnum.value = natureData?.data || [];
  } catch (error) {
    console.error('firm-edit-onMounted', error);
  }
});

// 关闭抽屉
const handleClose = (refresh = false) => {
  props.close && props.close(refresh);
};

const handleLayoutChange = (event, isFull) => {
  formState.value = {
    ...formState.value,
    isFull
  };
};

// 提交form表单
const onSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    const companyAttachmentDTO =
      _.map(annexFileList.value, (item) => {
        return { fileId: item?.fileId, fileSize: item?.file?.size || item.size, fileName: item?.file?.name || item.name };
      }) || formData?.companyAttachmentDTO;
    const params = {
      ...formData,
      registeredTime: !isNull(formData?.registeredTime) ? getTime(formData?.registeredTime) : '',
      ...unref(regionData),
      companyAttachmentDTO
    };
    console.log('params', params);
    const API = isCreate ? companyCreate : companyUpdate;
    await API({ ...params });
    handleClose(true);
  } catch (error) {
    console.error('firm-edit-onSubmit', error);
  }
};
</script>

<style lang="less" scope></style>
