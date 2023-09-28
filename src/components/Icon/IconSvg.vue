<template>
  <svg :fill="fillColor" :stroke="strokeColor">
    <use :xlink:href="'#' + name" v-bind="$attrs"></use>
  </svg>
</template>

<script setup>
import { onMounted } from 'vue';
const importAll = (requireContext) => requireContext.keys().forEach(requireContext);

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  fillColor: {
    type: String,
    default: null
  },
  strokeColor: {
    type: String,
    default: null
  }
});

onMounted(() => {
  try {
    importAll(require.context('@/assets/iconSvg', true, /\.svg$/));
  } catch (error) {
    console.error('components-IconSvg', error);
  }
});
</script>
