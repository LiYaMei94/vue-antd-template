<template>
  <div class="list-table-content">
    <ProTable ref="proTableRef" v-bind="{ formConfig, columns, requestApi: systemLoginLog, rowKey: 'infoId', formatSearchParams }"></ProTable>
  </div>
</template>
<script setup lang="jsx">
import { ref, unref, computed } from 'vue';
import { filterEnum, isObject } from '@/utils/utils';
import { SUCCESS_FAIL_STATUS_ENUM } from '@/utils/const';
import { systemLoginLog } from '@/api/system/log';
import { dateFormat, getTime } from '@/utils/day';

const loginStatus = [];
const proTableRef = ref();
const search = computed(() => unref(proTableRef.value?.search));

// 表单配置
const formConfig = [
  {
    label: '登录IP',
    value: 'ipaddr',
    el: 'input'
  },
  {
    label: '登录账号',
    value: 'userName',
    el: 'input'
  },
  {
    label: '登录状态',
    value: 'status',
    el: 'select',
    props: {
      options: SUCCESS_FAIL_STATUS_ENUM,
      showSearch: true,
      optionFilterProp: 'label'
    }
  },
  {
    label: '登录时间',
    value: 'loginTime',
    el: 'range-picker'
  }
];

// table配置
const columns = [
  {
    title: '访问编码',
    dataIndex: 'infoId',
    ellipsis: true
  },
  {
    title: '登录账号',
    dataIndex: 'userName',
    width: 125
  },
  {
    title: '登录IP',
    dataIndex: 'ipaddr',
    width: 115
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    ellipsis: true,
    width: 125
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    ellipsis: true,
    width: 120
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    ellipsis: true
  },
  {
    title: '登录状态',
    dataIndex: 'status',
    width: 80,
    customRender({ text }) {
      const item = filterEnum(text, SUCCESS_FAIL_STATUS_ENUM, null, 'group');
      return isObject(item) ? <a-tag color={item?.color}>{item?.label}</a-tag> : text;
    }
  },
  {
    title: '操作信息',
    dataIndex: 'msg',
    ellipsis: true
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    customRender: function ({ text }) {
      return dateFormat(text);
    },
    width: 150
  }
];

// 自定义搜索参数
const formatSearchParams = ({ loginTime, ...other }) => {
  return {
    ...other,
    startTime: loginTime && loginTime[0] && getTime(loginTime[0]),
    endTime: loginTime && loginTime[1] && getTime(loginTime[1])
  };
};
</script>

<style lang="less" scope></style>
