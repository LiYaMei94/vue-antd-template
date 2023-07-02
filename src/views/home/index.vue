<template>
  <div>
    <!-- <SearchForm
      :columns="columns"
      :formatSearchParams="formatSearchParams"
      :search="search"
    ></SearchForm> -->
    <ProTable v-bind="{ formConfig, formatSearchParams, columns }"></ProTable>
  </div>
</template>

<script setup>
import SearchForm from '@/components/SearchForm';
import ProTable from '@/components/ProTable';
import { ref } from 'vue';
import { dateFormat, getTime } from '@/utils/day';

const columns = [
  {
    title: '用户姓名',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    disabled: true
  },
  {
    title: '学校',
    dataIndex: 'school'
  }
];

const formConfig = [
  {
    value: 'name',
    label: '用户姓名',
    el: 'input',
    props: { placeholder: '用户姓名' }
  },
  { value: 'age', label: '用户年龄', el: 'input-number' },
  {
    value: 'sex',
    label: '性别',
    el: 'select',
    props: {
      options: [
        {
          label: '女',
          value: 0
        }
      ]
    }
  },
  {
    value: 'school',
    label: '学校',
    el: 'select',
    props: {
      options: [
        {
          key: '学校1',
          value: 'school1'
        }
      ],
      fieldNames: {
        label: 'key'
      }
    }
  },
  {
    value: 'date1',
    label: '日期1',
    el: 'date-picker',
    props: {}
  },
  {
    value: 'time1',
    label: '时间1',
    el: 'time-picker',
    props: {}
  },
  {
    value: 'city',
    label: '城市',
    el: 'cascader',
    props: {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    value: 'tree',
    label: '树形选择',
    el: 'tree-select',
    props: {
      treeNodeFilterProp: 'label',
      showSearch: true,
      treeDefaultExpandAll: true,
      treeData: [
        {
          label: 'parent 1',
          value: 'parent 1',
          children: [
            {
              label: 'parent 1-0',
              value: 'parent 1-0',
              children: [
                {
                  label: 'my leaf',
                  value: 'leaf1'
                },
                {
                  label: 'your leaf',
                  value: 'leaf2'
                }
              ]
            },
            {
              label: 'parent 1-1',
              value: 'parent 1-1'
            }
          ]
        }
      ]
    }
  }
];

const formatSearchParams = ({ date1, time1, ...other }) => {
  return {
    ...other,
    date1: date1 && dateFormat(date1)
  };
};

const search = (params) => {
  console.log('params==', params);
};
</script>
