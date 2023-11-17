<template>
  <CustomDrawer
    :width="850"
    placement="right"
    :visible="visible"
    :title="title"
    v-bind="{ onOk: onSubmit, onCancel: () => handleClose(false), isDetail }"
  >
    <CardHeaderTitle title="基础信息"></CardHeaderTitle>
    <a-form
      autocomplete="off"
      ref="formRef"
      :model="formState"
      :labelCol="{ span: 4 }"
      :class="{ 'form-all-disable': isDetail ? true : false }"
      :rules="rules"
      class="menu-edit"
    >
      <a-form-item label="菜单名称" name="menuName">
        <a-input placeholder="请输入菜单名称" v-model:value="formState.menuName" :show-count="!isDetail" :maxlength="8"></a-input>
      </a-form-item>
      <a-form-item label="排序" name="orderNum">
        <a-input placeholder="请输入排序" v-model:value="formState.orderNum" :show-count="!isDetail" :maxlength="10"></a-input>
      </a-form-item>
      <a-form-item name="status">
        <template #label>
          <QuestionTooltip v-bind="{ title: '选择停用则路由将不会出现在侧边栏，也不能被访问', label: '启用状态' }"></QuestionTooltip>
        </template>
        <a-radio-group v-model:value="formState.status">
          <template v-for="item in ENABLE_DISABLE_STATUS_ENUM" :key="item.value">
            <a-radio :value="item.value">{{ item.label }}</a-radio>
          </template>
        </a-radio-group>
      </a-form-item>
      <CardHeaderTitle title="菜单类型"></CardHeaderTitle>
      <a-form-item label="" name="menuType" style="padding-left: 14px">
        <a-radio-group v-model:value="formState.menuType">
          <template v-for="item in MENU_TYPE_MAP" :key="item.value">
            <a-radio :value="item.value">{{ item.label }}</a-radio>
          </template>
        </a-radio-group>
      </a-form-item>
      <div class="tree-select-wrap">
        <div class="tree-select-content">
          <component :is="childComponent" ref="menuTypeRef" :defaultData="defaultData" :parentMenu="parentMenu" :isDetail="isDetail"></component>
        </div>
      </div>
    </a-form>
  </CustomDrawer>
</template>
<script setup lang="jsx">
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import {
  CREATE,
  PAGE_TITLE_MAP,
  EDIT,
  DETAIL,
  ENABLE_DISABLE_STATUS_ENUM,
  MENU_TYPE_MAP,
  YES_OR_NO,
  MENU_TYPE_T,
  MENU_TYPE_C,
  MENU_TYPE_F,
  MENU_HIDDEN_TYPE,
  CONST_STRING_0,
  CONST_STRING_1,
  AGREEMENT_ENUM
} from '@/utils/const';
import { systemMenuDetail, systemMenuCreate, systemMenuUpdate, systemMenuTreeSelect } from '@/api/system/menu';
import CardHeaderTitle from '@/components/PageComs/CardHeaderTitle';
import { isObject, filterEnum, isNull } from '@/utils/utils';
import { rules } from './js/editRules';
import TopNav from './components/TopNav';
import Button from './components/Button';
import Menu from './components/Menu';
import { updateFormData } from './js/index';
import _ from 'lodash';
import { usePermission } from '@/hooks/usePermission';

const { refresh } = usePermission();

const components = {
  [MENU_TYPE_T]: TopNav,
  [MENU_TYPE_C]: Menu,
  [MENU_TYPE_F]: Button
};

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

const menuTypeRef = ref(null);
const formRef = ref(null);
const isDetail = props.type === DETAIL;
const isEdit = props.type === EDIT;
const isCreate = props.type === CREATE;
const title = `${PAGE_TITLE_MAP[props.type]}菜单`;
const formState = ref({
  status: CONST_STRING_1,
  menuType: MENU_TYPE_T,
  isFrame: CONST_STRING_0,
  orderNum: 0,
  visible: CONST_STRING_1,
  pageLayout: CONST_STRING_1
});
const parentMenu = ref([]);
const defaultData = ref({ ...formState?.value });
const childComponent = computed(() => {
  return components[formState.value?.menuType];
});
const menuTypeValidate = computed(() => {
  return menuTypeRef.value?.handleValidate;
});
const menuTypeSubmit = computed(() => {
  return menuTypeRef.value?.handleSubmit;
});

// 获取详情回填form表单
const getDetail = async () => {
  try {
    const detail = await systemMenuDetail({ menuId: props.id });
    const childDetail = _.cloneDeep(detail?.data);
    formState.value = { ...detail?.data } || {};
    defaultData.value = { ...childDetail };
  } catch (error) {
    console.error('menu-edit-getDetail', error);
  }
};

onMounted(async () => {
  try {
    !isCreate && props.id && (await getDetail());
    const menuTree = await systemMenuTreeSelect();
    parentMenu.value = menuTree?.data || [];
  } catch (error) {
    console.error('menu-edit-onMounted', error);
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
    formRef.value?.validateFields();
    await (menuTypeValidate.value && menuTypeValidate.value());
    const formData = unref(formState);
    const childFormData = menuTypeSubmit.value && menuTypeSubmit.value();
    const params = {
      ...formData,
      ...childFormData,
      status: formData?.status,
      menuName: formData?.menuName,
      orderNum: formData?.orderNum,
      menuType: formData?.menuType
    };
    const API = isCreate ? systemMenuCreate : systemMenuUpdate;
    await API({ ...params });
    handleClose(true);
    // 更新现有路由和菜单
    refresh && refresh();
  } catch (error) {
    console.error('menu-edit-onSubmit', error);
  }
};
</script>

<style lang="less" scope>
.menu-edit {
  .tree-select-wrap {
    .radio-wrap {
      box-sizing: border-box;
      padding: 20px 0 20px 15px;
    }
    .tree-select-content {
      border: 1px dashed var(--private-border-color);
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
