<template>
  <CardHeaderTitle title="基本信息"></CardHeaderTitle>
  <a-form
    autocomplete="off"
    ref="formRef"
    :model="formState"
    :labelCol="{ span: 4 }"
    :class="{ 'form-all-disable': isDetail ? true : false }"
    :rules="allRules"
  >
    <a-form-item label="账号" name="userName">
      <a-input
        v-model:value="formState.userName"
        :disabled="!isCreate"
        allowClear
        :show-count="!isDetail"
        :maxlength="20"
        placeholder="请输入账号"
      ></a-input>
    </a-form-item>
    <a-form-item label="姓名" name="realName">
      <a-input v-model:value="formState.realName" allowClear :show-count="!isDetail" :maxlength="20" placeholder="请输入姓名"></a-input>
    </a-form-item>
    <a-form-item label="电话" name="phoneNumber">
      <a-input v-model:value="formState.phoneNumber" allowClear :show-count="!isDetail" :maxlength="11" placeholder="请输入电话"></a-input>
    </a-form-item>
    <a-form-item label="性别" name="sex">
      <a-select
        v-model:value="formState.sex"
        allowClear
        showSearch
        :fieldNames="{ label: 'dictLabel', value: 'dictValue' }"
        optionFilterProp="dictLabel"
        placeholder="请选择性别"
        :options="sexEnum"
      ></a-select>
    </a-form-item>
    <a-form-item label="证件类型" name="idType">
      <a-select
        v-model:value="formState.idType"
        allowClear
        showSearch
        :fieldNames="{ label: 'dictLabel', value: 'dictValue' }"
        optionFilterProp="dictLabel"
        placeholder="请选择证件类型"
        :options="idTypeEnum"
        @change="changeIdType"
      ></a-select>
    </a-form-item>
    <a-form-item label="证件号码" name="idNumber">
      <a-input
        v-model:value="formState.idNumber"
        allowClear
        :show-count="!isDetail"
        :maxlength="idNumberMap[formState.idType]?.maxlength"
        placeholder="请输入证件号码"
      ></a-input>
    </a-form-item>
    <a-form-item label="国籍" name="country">
      <a-select
        v-model:value="formState.country"
        allowClear
        showSearch
        :fieldNames="{ label: 'dictLabel', value: 'dictValue' }"
        optionFilterProp="dictLabel"
        placeholder="请选择国籍"
        :options="countryEnum"
      ></a-select>
    </a-form-item>
    <a-form-item label="账号状态" name="status">
      <a-radio-group v-model:value="formState.status">
        <template v-for="item in ENABLE_DISABLE_STATUS_ENUM" :key="item.value">
          <a-radio :value="item.value">{{ item.label }}</a-radio>
        </template>
      </a-radio-group>
    </a-form-item>
    <CardHeaderTitle title="详细信息"></CardHeaderTitle>
    <a-form-item label="所属组织(部门)" name="companyOrgId">
      <a-tree-select
        v-model:value="formState.companyOrgId"
        allowClear
        showSearch
        :fieldNames="{ label: 'companyOrgName', value: 'companyOrgId' }"
        tree-node-filter-prop="companyOrgName"
        placeholder="请选择所属组织(部门)"
        :tree-data="organizationData"
        :treeDefaultExpandAll="true"
      ></a-tree-select>
    </a-form-item>
    <a-form-item label="员工工号" name="jobNum">
      <a-input v-model:value="formState.jobNum" allowClear :show-count="!isDetail" :maxlength="20" placeholder="请输入员工工号"></a-input>
    </a-form-item>
    <a-form-item label="员工类别" name="employeeType">
      <a-select
        v-model:value="formState.employeeType"
        allowClear
        showSearch
        :fieldNames="{ label: 'dictLabel', value: 'dictValue' }"
        optionFilterProp="dictLabel"
        placeholder="请选择员工类别"
        :options="employeeTypeEnum"
      ></a-select>
    </a-form-item>
    <CardHeaderTitle title="资料附件"></CardHeaderTitle>
    <a-row>
      <a-col :span="4"></a-col>
      <a-col :span="20">
        <Upload
          ref="annexRef"
          v-bind="{
            disabled: isDetail,
            maxCount: 10,
            uploadRequest: uploadAttachmentFile,
            downloadRequest: fileDownload,
            deleteFileRequest: deleteFileAnnex,
            size: 125,
            accept: '.jpg, .png, .jpeg, .pdf',
            errorTip: 'border',
            defaultFileList: annexDefaultFileList,
            uploadParams: { ...otherParams },
            deleteAuth
          }"
        />
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted, watchEffect } from 'vue';
import { CREATE, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, CONST_STRING_1, CONST_STRING_0 } from '@/utils/const';
import { getDictDataValue } from '@/api/system/dict';
import { organizationList } from '@/api/business/organization';
import { fileDownload, uploadAttachmentFile } from '@/api/file';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import Upload from '@/components/Upload/index.vue';
import { isObject, filterEnum, isNull } from '@/utils/utils';
import { rules } from './js/editRules';
import _ from 'lodash';

const props = defineProps({
  defaultFormValue: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: CREATE
  },
  deleteFileAnnex: {
    type: Function,
    default: null
  },
  otherParams: {
    type: Object,
    default: {
      userType: '0'
    }
  },
  deleteAuth: {
    type: Array,
    default: []
  }
});

const idNumberMap = {
  0: {
    reg: /^[A-Z0-9]{18}$/, //身份证
    maxlength: 18
  },
  1: {
    reg: /^[A-Z0-9]{9}$/, //护照
    maxlength: 9
  }
};
const formRef = ref(null);
const annexRef = ref(null);
const isDetail = props.type === DETAIL;
const isCreate = props.type === CREATE;
const formState = ref({ status: CONST_STRING_1 });
const sexEnum = ref([]);
const idTypeEnum = ref([]);
const employeeTypeEnum = ref([]);
const countryEnum = ref([]);
const annexFileList = computed(() => annexRef?.value?.fileList); // 附件资料
const annexDefaultFileList = ref([]); // 附件回显
const allRules = ref(rules);
const organizationData = ref([]);

watchEffect(() => {
  formState.value = { ...formState.value, ...props.otherParams, ...props.defaultFormValue };
  annexDefaultFileList.value = _.map(props.defaultFormValue?.extendUserList, (item) => {
    return { ...item, name: item?.fileName, size: item?.fileSize };
  });
});

watch(
  () => formState.value.idType,
  (val) => {
    if (!isNull(val)) {
      const idNumber = {
        validator: async (_rule, value) => {
          const reg = idNumberMap[val]?.reg;
          if (!reg.test(value) && !isNull(value)) {
            return Promise.reject('请输入正确的证件号');
          } else {
            return Promise.resolve();
          }
        }
      };
      allRules.value = { ...allRules.value, idNumber };
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => props.otherParams,
  async (val) => {
    try {
      if (!isNull(val?.companyId)) {
        const tree = await organizationList({ companyId: val?.companyId });
        organizationData.value = tree?.treeData || [];
      }
    } catch (error) {
      console.error('props.otherParams?.companyId-watch', error);
    }
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  try {
    // 证件类型
    const idTypeData = await getDictDataValue({ dictType: 'id_type' });
    idTypeEnum.value = idTypeData?.data || [];
    // 用户性别
    const sexData = await getDictDataValue({ dictType: 'user_sex' });
    sexEnum.value = sexData?.data || [];
    // 员工类别
    const employeeTypeData = await getDictDataValue({ dictType: 'employee_type' });
    employeeTypeEnum.value = employeeTypeData?.data || [];
    // 国籍
    const countryData = await getDictDataValue({ dictType: 'nationality' });
    countryEnum.value = countryData?.data || [];
  } catch (error) {
    console.error('PersonnelMaintain-onMounted', error);
  }
});

const validateFields = async () => {
  await formRef.value?.validateFields();
};

const changeIdType = () => {
  formState.value.idNumber = null;
};

defineExpose({ formState, validateFields, annexFileList });
</script>
