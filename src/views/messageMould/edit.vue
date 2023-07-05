<template>
  <div class="page-level2">
    <PageHeader :title="title">
      <template #pageHeaderRight>
        <CloseOutlined style="font-size: 15px" @click="close"></CloseOutlined>
      </template>
    </PageHeader>
    <a-form
      ref="formRef"
      :model="formState"
      :labelCol="{ span: spanSizeConfig.formLabelColSpan }"
      :class="{ 'form-all-disable': isDetail ? true : false }"
      @finish="submit"
    >
      <div class="page-form-content">
        <CardHeaderTitle title="基本属性"></CardHeaderTitle>
        <a-row>
          <a-col v-if="!isCreate" :span="spanSizeConfig.colSpan12">
            <a-form-item label="模板编码" name="id">
              <a-input :disabled="isEdit" v-model:value="formState.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="模板名称" name="name" :rules="[{ required: true, message: '请输入模板名称' }]">
              <a-input placeholder="请输入模板名称" v-model:value.trim="formState.name"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="spanSizeConfig.colSpan24">
            <a-form-item :labelCol="{ span: spanSizeConfig.colSpan24LabelCol }" label="业务描述" name="businessKey">
              <a-input placeholder="请输入业务描述" v-model:value.trim="formState.businessKey"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="接收账号类型" name="idType" :rules="[{ required: true, message: '请选择接收账号类型' }]">
              <a-select
                placeholder="请选择接收账号类型"
                v-bind="{ options: idTypeEnum, fieldNames: { label: 'desc', value: 'id' }, showSearch: true, optionFilterProp: 'desc' }"
                v-model:value="formState.idType"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="消息类型" name="msgType" :rules="[{ required: true, message: '请选择消息类型' }]">
              <a-select
                placeholder="请选择消息类型"
                v-bind="{ options: msgTypeEnum, fieldNames: { label: 'desc', value: 'id' }, showSearch: true, optionFilterProp: 'desc' }"
                v-model:value="formState.msgType"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="模板类型" name="templateType" :rules="[{ required: true, message: '请选择模板类型' }]">
              <a-radio-group v-model:value="formState.templateType">
                <template v-for="item in TEMPLATE_STATUS_TYPE_ENUM" :key="item.value">
                  <a-radio :value="item.value">{{ item.label }}</a-radio>
                </template>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="开启状态" name="templateStatus" :rules="[{ required: true, message: '请选择开启状态' }]">
              <a-radio-group v-model:value="formState.templateStatus">
                <template v-for="item in templateStatusEnum" :key="item.id">
                  <a-radio :value="item.id">{{ item.desc }}</a-radio>
                </template>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="spanSizeConfig.colSpan24">
            <a-form-item :labelCol="{ span: spanSizeConfig.colSpan24LabelCol }" label="备注" name="remark">
              <a-textarea placeholder="请输入备注" v-model:value="formState.remark"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <CardHeaderTitle title="发送信息"></CardHeaderTitle>
        <a-row>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="发送渠道" name="sendChannel" :rules="[{ required: true, message: '请选择发送渠道' }]">
              <a-select
                placeholder="请选择发送渠道"
                v-bind="{
                  options: channelTypeEnum,
                  fieldNames: { label: 'desc', value: 'id' },
                  showSearch: true,
                  optionFilterProp: 'desc'
                }"
                v-model:value="formState.sendChannel"
                @change="sendChannelChange"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="spanSizeConfig.colSpan12">
            <a-form-item label="发送账号" name="channelAccountId" :rules="[{ required: true, message: '请选择发送账号' }]">
              <a-select
                placeholder="请选择发送账号"
                v-bind="{
                  options: channelAccountEnum,
                  fieldNames: { label: 'name', value: 'id' },
                  showSearch: true,
                  optionFilterProp: 'desc'
                }"
                v-model:value="formState.channelAccountId"
              >
                <template #option="{ value: val, name, creator }">
                  <span :aria-label="val">{{ name }}</span>
                  &nbsp;&nbsp;【{{ creator }}】
                </template>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <component
          :is="MESSAGE_MOULD_PAGECOM[formState.sendChannel]"
          ref="sendContentRef"
          v-bind="{ ref: 'sendContentRef', spanSizeConfig, isDetail, isCreate, basicData: formState, channelAccountId: formState.channelAccountId }"
        ></component>
      </div>
      <PageFooter>
        <template #pageFooterRight>
          <a-button @click="close">{{ !isDetail ? '取消' : '关闭' }}</a-button>
          <a-button v-if="!isDetail" class="margin-left-10" type="primary" html-type="submit">提交</a-button>
        </template>
      </PageFooter>
    </a-form>
  </div>
</template>
<script setup>
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL, CHANNEL_ACCOUNT_CONFIG_DEMO, TEMPLATE_STATUS_TYPE_ENUM } from '@/utils/const';
import { mouldDetail, mouldSave } from '@/apis/mould';
import { channelAccount } from '@/apis/channel';
import PageHeader from '@/components/PageComs/PageHeader';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import PageFooter from '@/components/PageComs/PageFooter';
import MiniProgram from './components/MiniProgram';
import Sms from './components/Sms';
import Email from './components/Email';
import { resultCallBack } from '@/utils/utils';
import { useStore } from 'vuex';

const { state: storeState } = useStore();

const spanSizeConfig = {
  colSpan24: 24,
  colSpan24LabelCol: 3,
  colSpan12: 12,
  formLabelColSpan: 6
};
const sendContentRef = ref(null);
const formRef = ref(null);
const route = useRoute();
const router = useRouter();
const type = route.params.type;
const id = route.params.id;
const isDetail = type === DETAIL;
const isEdit = type === EDIT;
const isCreate = type === CREATE;
const title = `${PAGE_TITLE_MAP[type]}-消息模板`;
const channelAccountEnum = ref([]);
const formState = ref({});

const SEND_CHANNEL_SMS = 30; // 短信
const SEND_CHANNEL_EMAIL = 40; // 邮件
const SEND_CHANNEL_MINI = 60; // 小程序
const MESSAGE_MOULD_PAGECOM = {
  [SEND_CHANNEL_SMS]: Sms,
  [SEND_CHANNEL_EMAIL]: Email,
  [SEND_CHANNEL_MINI]: MiniProgram
};

const callback = computed(() => sendContentRef.value?.handleSubmit);
const channelTypeEnum = computed(() => storeState?.global?.allEnum?.channelType);
const idTypeEnum = computed(() => storeState?.global?.allEnum?.idType);
const msgTypeEnum = computed(() => storeState?.global?.allEnum?.messageType);
const templateStatusEnum = computed(() => storeState?.global?.allEnum?.messageTemplateStatus);

const init = async () => {
  try {
    // 获取详情回填form表单
    const detail = await mouldDetail({ id });
    const result = await channelAccount({ channelType: detail?.data?.sendChannel, creator: 'haojinke' });
    channelAccountEnum.value = result?.data;
    formState.value = detail?.data || {};
  } catch (error) {}
};

onMounted(() => {
  !isCreate && id && init();
});

// 发送内容根据发送渠道展示不同的组件
const sendContentCom = computed(() => {
  const sendChannel = formState.value.sendChannel;
  return MESSAGE_MOULD_PAGECOM[sendChannel];
});

// 发送渠道改变:1:获取对应的组件,2:获取发送账号
const sendChannelChange = async (value) => {
  try {
    const result = await channelAccount({ channelType: value, creator: 'haojinke' });
    channelAccountEnum.value = result?.data;
    formState.value.channelAccountId = null;
  } catch (error) {}
};

const close = () => {
  router.go(-1);
};

const submit = async () => {
  try {
    // 调用子组件的方法获取参数
    const childData = await (callback.value && callback.value());
    const result = await mouldSave({ id, ...formState.value, ...childData });
    resultCallBack({ result, successMessage: '保存成功' }).then(async (res) => {
      close();
    });
  } catch (error) {}
};
</script>

<style lang="less" scoped>
.page-form-content {
  padding-right: 100px;
}
</style>
