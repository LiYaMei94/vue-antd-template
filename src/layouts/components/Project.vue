<template>
  <a-select
    v-model:value="value"
    show-search
    placeholder="请选择项目"
    style="width: 185px"
    :options="options"
    :filter-option="true"
    optionFilterProp="label"
    @change="handleChange"
    class="project-select"
  ></a-select>
</template>
<script setup>
import { ref } from 'vue';

const value = ref(null);
const options = ref([
  {
    value: 'jack',
    label: 'Jack'
  },
  {
    value: 'lucy',
    label: 'Lucy'
  },
  {
    value: 'tom',
    label: 'Tom'
  }
]);

const handleChange = (value) => {
  console.log(`selected ${value}`);
};
</script>
<style lang="less">
.project-select {
}
</style>
