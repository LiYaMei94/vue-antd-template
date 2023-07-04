<template>
  <a-drawer :width="650" placement="right" :visible="visible" @close="handleClose(false)" :title="title">
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 5 }" :class="{ 'form-all-disable': isDetail ? true : false }">
      <a-form-item label="账号编码" name="id" v-if="!isCreate">
        <a-input :disabled="isEdit" v-model:value="formState.id"></a-input>
      </a-form-item>
      <a-form-item label="账号名称" name="name" :rules="[{ required: true, message: '请输入账号名称' }]">
        <a-input placeholder="请输入账号名称" v-model:value.trim="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="发送渠道" name="sendChannel" :rules="[{ required: true, message: '请选择发送渠道' }]">
        <a-select
          placeholder="请选择发送渠道"
          v-bind="{ options: channelTypeEnum, fieldNames: { label: 'desc', value: 'id' }, showSearch: true, optionFilterProp: 'desc' }"
          v-model:value="formState.sendChannel"
        ></a-select>
      </a-form-item>
      <a-form-item label="账号设置" name="accountConfig" :rules="[{ required: true, message: '请输入账号设置' }]">
        <a-input placeholder="请输入账号设置" v-model:value="formState.accountConfig"></a-input>
      </a-form-item>
      <a-form-item label="">
        <a-row>
          <a-col :span="5"></a-col>
          <a-col :span="19">
            <pre class="tip-container" v-html="syntaxHighlight(CHANNEL_ACCOUNT_CONFIG_DEMO)"></pre>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea placeholder="请输入备注" v-model:value="formState.remark"></a-textarea>
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
<script setup>
import { ref, watch, reactive, unref, toRefs, computed } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL, CHANNEL_ACCOUNT_CONFIG_DEMO } from '@/utils/const';
import { syntaxHighlight } from '@/utils/utils';
import { channelDetail, channelSave } from '@/apis/channel';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

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
const title = `${PAGE_TITLE_MAP[props.type]}渠道账号`;
const formState = ref({
  name: '',
  sendChannel: null,
  accountConfig: '',
  remark: ''
});

const { state: storeState } = useStore();
const channelTypeEnum = computed(() => storeState?.global?.allEnum?.channelType);
// 获取详情回填form表单
const getChannelDetail = async () => {
  try {
    const detail = await channelDetail({ id: props.id });
    formState.value = detail?.data || {};
  } catch (error) {}
};
!isCreate && props.id && getChannelDetail();

// 关闭抽屉
const handleClose = (refresh = false) => {
  props.close && props.close(refresh);
};

// 提交form表单
const onSubmit = async () => {
  try {
    await formRef.value?.validateFields();
    const formData = unref(formState);
    await channelSave({ ...formData });
    handleClose(true);
  } catch (error) {}
};
</script>

<style lang="less" scoped></style>
