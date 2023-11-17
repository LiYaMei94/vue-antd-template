<template>
  <a-modal :width="650" placement="right" :visible="visible" @cancel="handleClose(false)" :title="title">
    <a-form
      autocomplete="off"
      ref="formRef"
      :model="formState"
      :labelCol="{ span: 3 }"
      :class="{ 'form-all-disable': isDetail ? true : false }"
      :rules="rules"
    >
      <a-form-item label="账号编码" name="dictCode" v-if="!isCreate">
        <a-input :disabled="isEdit" v-model:value="formState.dictCode"></a-input>
      </a-form-item>
      <a-form-item label="数据标签" name="dictLabel">
        <a-input placeholder="请输入数据标签" v-model:value.trim="formState.dictLabel" :show-count="!isDetail" :maxlength="20"></a-input>
      </a-form-item>
      <a-form-item label="数据键值" name="dictValue">
        <a-input placeholder="请输入数据键值" v-model:value.trim="formState.dictValue" :show-count="!isDetail" :maxlength="20"></a-input>
      </a-form-item>
      <a-form-item label="字典标识" name="dictType">
        <a-input placeholder="请输入数据键值" disabled v-model:value.trim="formState.dictType"></a-input>
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
    <template #footer>
      <div class="ant-drawer-footer-custom">
        <a-button @click="handleClose(false)">{{ !isDetail ? '取消' : '关闭' }}</a-button>
        <a-button v-if="!isDetail" class="margin-left-10" type="primary" @click="onSubmit">提交</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL, ENABLE_DISABLE_STATUS_ENUM, CONST_STRING_1 } from '@/utils/const';
import { systemDictDataDetail, systemDictDataUpdate, systemDictDataCreate, systemDictDetail } from '@/api/system/dict';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { isNull } from '@/utils/utils';
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
  },
  dictId: {
    type: [String, Number]
  }
});

const formRef = ref(null);
const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const title = `${PAGE_TITLE_MAP[props.type]}字典数据值`;
const formState = ref({
  status: CONST_STRING_1,
  dictType: ''
});

const getDictDetail = async () => {
  try {
    const detail = await systemDictDetail({ dictId: props.dictId });
    formState.value.dictType = detail?.data?.dictType;
  } catch (error) {
    console.error('dictData-edit-getDictDetail', error);
  }
};
isCreate && props.dictId && getDictDetail();

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await systemDictDataDetail({ dictCode: props.id });
    formState.value = detail?.data || {};
  } catch (error) {
    console.error('dictData-edit-getDetail', error);
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
    const API = isCreate ? systemDictDataCreate : systemDictDataUpdate;
    await API({ ...formData });
    handleClose(true);
  } catch (error) {
    console.error('dictData-edit-onSubmit', error);
  }
};
</script>

<style lang="less" scoped></style>
