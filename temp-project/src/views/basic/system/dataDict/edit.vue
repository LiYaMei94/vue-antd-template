<template>
  <CustomDrawer
    :width="900"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false), isDetail }"
  >
    <CardHeaderTitle title="字典信息"></CardHeaderTitle>
    <a-form
      autocomplete="off"
      ref="formRef"
      :model="formState"
      :labelCol="{ span: 3 }"
      :class="{ 'form-all-disable': isDetail ? true : false }"
      :rules="rules"
    >
      <a-form-item label="账号编码" name="dictId" v-if="!isCreate">
        <a-input :disabled="isEdit" v-model:value="formState.dictId"></a-input>
      </a-form-item>
      <a-form-item label="字典名称" name="dictName">
        <a-input placeholder="请输入字典名称" v-model:value.trim="formState.dictName" :show-count="!isDetail" :maxlength="50"></a-input>
      </a-form-item>
      <a-form-item label="字典标识" name="dictType">
        <a-input placeholder="请输入字典标识" v-model:value.trim="formState.dictType" :show-count="!isDetail" :maxlength="50"></a-input>
      </a-form-item>
      <a-form-item label="是否启用" name="status">
        <a-radio-group v-model:value="formState.status">
          <template v-for="item in ENABLE_DISABLE_STATUS_ENUM" :key="item.value">
            <a-radio :value="item.value">{{ item.label }}</a-radio>
          </template>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea placeholder="请输入备注" v-model:value="formState.remark" :show-count="!isDetail" :maxlength="200"></a-textarea>
      </a-form-item>
    </a-form>
    <template v-if="isDetail">
      <CardHeaderTitle title="数据值"></CardHeaderTitle>
      <ProTable
        ref="proTableRef"
        v-bind="{
          formConfig,
          columns,
          requestApi: systemDictDataList,
          rowKey: 'dictCode',
          labelCol: { span: 6 },
          tableName: 'system-dict-detail-data',
          showToolButton: false,
          firstRequestAuto: false,
          searchFormCol: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2 },
          defaultSearchParams: { dictType: formState.dictType }
        }"
      ></ProTable>
    </template>
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, CONST_STRING_1 } from '@/utils/const';
import { systemDictDataList, systemDictUpdate, systemDictCreate, systemDictDetail } from '@/api/system/dict';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import { isNull, isObject, filterEnum } from '@/utils/utils';
import { rules } from './js/editRules';

const { push } = useRouter();
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
const title = `${PAGE_TITLE_MAP[props.type]}字典`;
const formState = ref({
  status: CONST_STRING_1
});
const proTableRef = ref();
const search = computed(() => unref(proTableRef.value?.getTableData));

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await systemDictDetail({ dictId: props.id });
    formState.value = detail?.data || {};
    search.value && search.value({ dictType: detail?.data?.dictType });
  } catch (error) {
    console.error('dict-edit-getDetail', error);
  }
};

!isCreate && props.id && getDetail();

// 关闭抽屉
const handleClose = (refresh = false) => {
  props.close && props.close(refresh);
};

// 提交form表单
const onSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    const API = isCreate ? systemDictCreate : systemDictUpdate;
    await API({ ...formData });
    handleClose(true);
  } catch (error) {
    console.error('dict-edit-onSubmit', error);
  }
};

const formConfig = [
  {
    label: '数据标签',
    value: 'dictLabel',
    el: 'input',
    props: {
      showCount: true,
      maxlength: 20
    }
  }
];

const columns = [
  {
    title: '数据键值',
    dataIndex: 'dictValue'
  },
  {
    title: '数据标签',
    dataIndex: 'dictLabel',
    ellipsis: true
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    customRender({ text }) {
      const item = filterEnum(text, ENABLE_DISABLE_STATUS_ENUM, null, 'group');
      return <a-tag color={item?.color}>{item?.label}</a-tag>;
    }
  }
];
</script>

<style lang="less" scoped></style>
