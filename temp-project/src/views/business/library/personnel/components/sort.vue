<template>
  <a-modal v-model:visible="open" @cancel="handleCancel" @ok="handleOk" title="编辑组织">
    <a-form ref="formRef" :model="formState" :labelCol="{ span: 4 }" :rules="rules" autocomplete="off">
      <a-form-item name="companyOrgName" label="组织名称">
        <a-input
          v-model:value="formState.companyOrgName"
          placeholder="请输入组织名称"
          :disabled="formState?.defaultOrNot"
          allowClear
          :maxlength="20"
          showCount
        ></a-input>
      </a-form-item>
      <a-form-item name="parentId">
        <template #label>
          <QuestionTooltip v-bind="{ title: '不可选择当前节点的后继节点', label: '所属父级' }"></QuestionTooltip>
        </template>
        <a-tree-select
          v-model:value="formState.parentId"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择父级"
          :disabled="formState?.defaultOrNot"
          allow-clear
          tree-default-expand-all
          :tree-data="treeData"
          tree-node-filter-prop="companyOrgName"
          :fieldNames="{ label: 'companyOrgName', value: 'companyOrgId' }"
        ></a-tree-select>
      </a-form-item>
      <a-form-item name="sort" label="排序">
        <a-input-number v-model:value="formState.sort" placeholder="请输入排序" :min="0" :max="9999"></a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { organizationDetail, organizationList, organizationUpdate } from '@/api/business/organization';
import { isNull } from '@/utils/utils';
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
const treeData = ref([]);
const selectedKeys = ref([]);
const rules = {
  sort: [
    {
      required: true,
      message: '请输入排序'
    }
  ],
  companyOrgName: [
    {
      required: true,
      message: '请输入组织名称',
      validator: async (_rule, value) => {
        const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{1,20}$/;
        if (isNull(value)) {
          return Promise.reject('请输入组织名称');
        } else if (!reg.test(value)) {
          return Promise.reject('请输入1~20位汉字、大小写英文字母、数字、常用符号');
        } else {
          return Promise.resolve();
        }
      }
    }
  ],
  parentId: [
    {
      required: false,
      message: '请选中父级'
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
    const detail = await organizationDetail({ ...props.requestParam });
    formState.value = { ...detail?.data, parentId: detail?.data?.parentId == 0 ? null : detail?.data?.parentId } || {};
    const result = await organizationList({ ...props.requestParam });
    treeData.value = result?.treeData || [];
  } catch (error) {
    console.error('ResetPassword-getDetail', error);
  }
};

const handleOk = async () => {
  try {
    await formRef.value?.validateFields();
    const { parentId } = formState.value || {};
    await organizationUpdate({ ...props.requestParam, ...formState.value, parentId: isNull(parentId) ? '0' : parentId });
    open.value = false;
    props.onOk && props.onOk();
  } catch (error) {
    console.error('sort-handleOk', error);
  }
};

const handleCancel = () => {
  props.onCancel && props.onCancel();
};
</script>

<style lang="less" scoped></style>
