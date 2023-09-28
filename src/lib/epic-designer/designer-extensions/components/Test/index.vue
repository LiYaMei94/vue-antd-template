<template>
  <div class="h-full box-border bg-white wh-full!">
    <slot name="edit-node">
      <slot v-for="item in children" name="node" :record="item" />
    </slot>
  </div>
</template>
<script setup>
import { ref, reactive, provide, computed, inject, onMounted } from 'vue';
import { Form, FormItem, Input } from 'ant-design-vue';

const props = defineProps({
  record: {
    type: Object,
    require: true,
    default: () => ({})
  }
});

const children = computed(() => {
  return props.record?.children ?? [];
});
</script>
