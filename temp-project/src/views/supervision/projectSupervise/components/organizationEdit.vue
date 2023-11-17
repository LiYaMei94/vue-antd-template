<template>
  <CustomDrawer :width="600" placement="right" :visible="visible" title="编辑监管组织" v-bind="{ onCancel: () => handleClose() }">
    <TreeEdit
      ref="treeRef"
      v-bind="{
        treeName: '监管组织',
        getTreeData,
        fieldNames: { title: 'supervisionName', key: 'supervisionId', children: 'children' },
        initRequest,
        isSearch: false,
        isLazyLoad: true,
        defaultSelectedKeys,
        defaultExpandedKeys,
        isEdit: true,
        onSave: handleSave
      }"
    ></TreeEdit>
    <template #footer>
      <div class="ant-drawer-footer-custom">
        <a-button @click="() => handleClose()">关闭</a-button>
      </div>
    </template>
  </CustomDrawer>
</template>
<script setup>
import { watch, reactive, unref, defineAsyncComponent, ref, computed } from 'vue';
import TreeEdit from '@/components/Tree';
import { isNull } from '@/utils/utils';
import _ from 'lodash';
import { message } from 'ant-design-vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  onCancel: {
    type: Function,
    default: null
  },
  getTreeData: {
    type: Function,
    default: null
  },
  defaultSelectedKeys: {
    type: Array,
    default: []
  },
  defaultExpandedKeys: {
    type: Array,
    default: []
  }
});

const treeRef = ref(null);
const selectedKeys = computed(() => treeRef.value?.selectedKeys);
const expandedKeys = computed(() => treeRef.value?.expandedKeys);
const initRequest = ref(true);

// 关闭抽屉
const handleClose = () => {
  props.onCancel && props.onCancel({ selectedKeys: selectedKeys.value, expandedKeys: expandedKeys.value });
  initRequest.value = false;
};

// 保存
const handleSave = async (current) => {
  console.log('current', current);
  try {
    const reg = /^[+\-*/=><%#$￥,;:\.!?()\[\]{}'"@\w\u4e00-\u9fff]{1,20}$/;
    if (isNull(current?.supervisionName)) {
      message.error('请输入组织名称');
      return;
    } else if (!reg.test(current?.supervisionName) && !isNull(current?.supervisionName)) {
      message.error('请输入1~20位汉字、大小写英文字母、数字、常用符号');
      return;
    }
    console.log(current);
    // const API = current?.add ? organizationCreate : organizationUpdate;
    // await API({
    //  ...current
    // });
  } catch (error) {
    console.error('organization-handleSave', error);
  }
};
</script>
