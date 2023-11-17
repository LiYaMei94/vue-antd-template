<template>
  <CustomDrawer
    :width="450"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ cancelText: !isDetail ? '取消' : '关闭', onCancel: () => handleClose(false), onOk: onSubmit, isDetail }"
  >
    <CardHeaderTitle title="角色信息"></CardHeaderTitle>
    <a-form
      autocomplete="off"
      ref="formRef"
      :model="formState"
      :labelCol="{ span: 5 }"
      :class="{ 'form-all-disable': isDetail || isAuthConfig ? true : false }"
      :rules="rules"
    >
      <a-form-item label="角色名称" name="roleName">
        <a-input placeholder="请输入角色名称" v-model:value="formState.roleName" :show-count="isCreate || isEdit" :maxlength="20"></a-input>
      </a-form-item>
      <a-form-item label="角色类型" name="roleType" v-if="!isAuthConfig">
        <a-radio-group v-model:value="formState.roleType" :disabled="isEdit">
          <a-radio value="1">系统角色</a-radio>
          <a-radio value="2">公司角色</a-radio>
          <a-radio value="3">项目角色</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="备注" name="remark" v-if="!isAuthConfig">
        <a-input placeholder="请输入备注" v-model:value="formState.remark" :show-count="!isDetail" :maxlength="200"></a-input>
      </a-form-item>
    </a-form>
    <div v-if="isAuthConfig">
      <CardHeaderTitle title="权限配置"></CardHeaderTitle>
      <AuthConfig
        ref="authConfigRef"
        v-bind="{
          detailApi: roleDetail,
          configApi: roleConfigAuthrity,
          roleId,
          nodeKey: 'menuId',
          nodeTitle: 'menuName',
          children: 'children',
          nodeParentKey: 'parentId'
        }"
      ></AuthConfig>
    </div>
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { CREATE, PAGE_TITLE_MAP, EDIT, DETAIL, AUTH, ENABLE_DISABLE_STATUS_ENUM, CONST_STRING_0 } from '@/utils/const';
import { roleCreate, roleUpdate, roleDetail, roleConfigAuthrity } from '@/api/role';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import { isObject, filterEnum } from '@/utils/utils';
import { rules } from './config/rule';
import AuthConfig from './treeConfig';

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
  roleId: {
    type: [String, Number]
  }
});

const formRef = ref(null);
const authConfigRef = ref();
const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const isAuthConfig = props.type === AUTH;
const title = props.type == 'authConfig' ? '权限配置' : `${PAGE_TITLE_MAP[props.type]}角色`;
const submitConfig = computed(() => authConfigRef.value?.submitConfig); // 刷新指定行数据
const formState = ref({
  roleName: '',
  roleType: '1',
  remark: ''
});

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await roleDetail({ roleId: props.roleId });
    formState.value = detail?.data || {};
  } catch (error) {
    console.error('role-getDetail', error);
  }
};

onMounted(async () => {
  try {
    !isCreate && props.roleId && (await getDetail());
  } catch (error) {
    console.error('role-getDetail-onMounted', error);
  }
});

// 关闭抽屉
const handleClose = (refresh = false) => {
  if (isAuthConfig) {
    props.close && props.close(refresh); //权限配置时不用刷新表格
  }
  props.close && props.close(refresh);
};

// 提交form表单
const onSubmit = async () => {
  try {
    if (isDetail) {
      handleClose(false);
    } else if (isAuthConfig) {
      submitConfig.value && (await submitConfig.value());
      handleClose(false);
    } else if (isCreate || isEdit) {
      await formRef.value?.validateFields();
      const formData = unref(formState);
      const API = isCreate ? roleCreate : roleUpdate;
      await API({ ...formData });
      handleClose(true);
    }
  } catch (error) {
    console.error('library-procedure-template-edit-onSubmit', error);
  }
};
</script>

<style lang="less" scoped></style>
