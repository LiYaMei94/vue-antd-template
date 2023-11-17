<template>
  <a-modal v-model:visible="open" @cancel="handleCancel" @ok="handleOk" title="重置密码">
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 4 }" :rules="rules" class="reset-password-wrap" autocomplete="off">
      <a-row>
        <span class="user-info">请输入“{{ formState?.userName }}”账号新密码</span>
      </a-row>
      <a-form-item name="password">
        <a-input-password v-model:value="formState.password" placeholder="请输入新密码"></a-input-password>
      </a-form-item>
      <a-row>
        <span class="default-rule-tip">密码规则：长度8～20</span>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { personnelDetail, personnelResetPwd } from '@/api/business/personnel';
import { isNull, resultCallBack } from '@/utils/utils';
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  onCancel: {
    type: Function,
    default: null
  },
  onOk: {
    type: Function,
    default: null
  },
  requestParam: {
    type: Object,
    default: null
  }
});
const formRef = ref(null);
const formState = ref({});
const rules = {
  password: [
    {
      required: true,
      validator: async (_rule, value) => {
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w]{8,20}$/;
        if (isNull(value)) {
          return Promise.reject('请输入新密码');
        } else if (!reg.test(value)) {
          return Promise.reject('请输入8~20位大小写英文字母、数字、常用符号');
        } else {
          return Promise.resolve();
        }
      }
    }
  ]
};
const open = ref(false);
watch(
  () => props.visible,
  async (val) => {
    open.value = val;
    if (val) {
      await getDetail();
    }
  }
);

// 获取详情
const getDetail = async () => {
  try {
    const detail = await personnelDetail({ ...props.requestParam });
    formState.value = detail?.data || {};
  } catch (error) {
    console.error('ResetPassword-getDetail', error);
  }
};

const handleOk = async () => {
  try {
    await formRef.value?.validateFields();
    const result = await personnelResetPwd({ ...props.requestParam, ...formState.value });
    resultCallBack(result, '密码重置成功').then((res) => {
      open.value = false;
      props.onOk && props.onOk();
    });
  } catch (error) {
    console.error('ResetPassword-handleOk', error);
  }
};

const handleCancel = () => {
  props.onCancel && props.onCancel();
};
</script>

<style lang="less" scoped>
.reset-password-wrap {
  .user-info {
    color: var(--private-second-text-color);
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 8px;
  }
  .default-rule-tip {
    color: var(--private-not-optional-text-color);
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
