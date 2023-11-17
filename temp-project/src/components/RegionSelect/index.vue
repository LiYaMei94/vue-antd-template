<template>
  <a-space>
    <a-select
      v-model:value="regionData.province"
      :style="{ width: `${width}px` }"
      :options="provinceData"
      @change="handleChange($event, 'province')"
      allowClear
      showSearch
      :fieldNames="{ label: 'name', value: 'regionId' }"
      optionFilterProp="name"
      placeholder="选择省"
    ></a-select>
    <a-select
      v-model:value="regionData.city"
      :style="{ width: `${width}px` }"
      :options="cityData"
      @change="handleChange($event, 'city')"
      allowClear
      showSearch
      :fieldNames="{ label: 'name', value: 'regionId' }"
      optionFilterProp="name"
      placeholder="选择市"
    ></a-select>
    <a-select
      v-model:value="regionData.area"
      :style="{ width: `${width}px` }"
      :options="areaData"
      allowClear
      showSearch
      :fieldNames="{ label: 'name', value: 'regionId' }"
      optionFilterProp="name"
      placeholder="选择区"
    ></a-select>
  </a-space>
</template>

<script setup>
import { computed, ref, watch, reactive, onMounted, onUnmounted, unref } from 'vue';
import { getRegionData } from '@/api';
import { isNull } from '@/utils/utils';

const props = defineProps({
  width: {
    type: Number,
    default: 150
  },
  defaultValue: {
    type: Object,
    default: null
  }
});

const provinceData = ref([]);
const cityData = ref([]);
const areaData = ref([]);
const regionData = ref({
  province: null,
  city: null,
  area: null
});

onMounted(async () => {
  try {
    const provinceInfo = await getRegionData({ parentCode: '00' });
    provinceData.value = provinceInfo?.data || [];

    if (!isNull(unref(props.defaultValue)) && JSON.stringify(unref(props.defaultValue)) !== '{}') {
      !isNull(props.defaultValue?.province) && (await handleSearch({ parentCode: props.defaultValue?.province, type: 'province' }));
      !isNull(props.defaultValue?.city) && (await handleSearch({ parentCode: props.defaultValue?.city, type: 'city' }));
      regionData.value = props.defaultValue || {};
    }
  } catch (error) {
    console.error('RegionSelect-onMounted', error);
  }
});

const handleSearch = async ({ parentCode, type }) => {
  try {
    if (!isNull(parentCode)) {
      const result = await getRegionData({ parentCode });
      switch (type) {
        case 'province':
          cityData.value = result?.data || [];
          areaData.value = [];
          regionData.value.city = null;
          regionData.value.area = null;
          break;
        case 'city':
          areaData.value = result?.data || [];
          regionData.value.area = null;
          break;
      }
      return result?.data;
    } else {
      switch (type) {
        case 'province':
          cityData.value = [];
          areaData.value = [];
          regionData.value.city = null;
          regionData.value.area = null;
          break;
        case 'city':
          areaData.value = [];
          regionData.value.area = null;
          break;
      }
    }
  } catch (error) {
    console.error('RegionSelect-handleSearch', error);
  }
};

const handleChange = (value, type) => {
  handleSearch({ parentCode: value, type });
};

defineExpose({ regionData });
</script>
