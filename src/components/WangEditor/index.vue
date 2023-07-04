<template>
  <div style="border: 1px solid var(--ant-line)">
    <Toolbar style="border-bottom: 1px solid var(--ant-line)" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @onFocus="handleFocus"
      @onBlur="handleBlur"
    />
  </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { isNull } from '@/utils/utils';

const props = defineProps({
  editorContent: {
    type: String,
    default: null
  },
  handleWangEditorBlur: {
    type: Function,
    default: null
  },
  disable: {
    type: Boolean,
    default: false
  }
});

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const mode = 'default'; // 或 'simple'
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...', focus: true };

// 内容 HTML
const valueHtml = ref(null);
watch(
  () => props.editorContent,
  (val) => {
    valueHtml.value = val;
  }
);

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // FIXME:记录 editor 实例，重要！
  handleInsertHtml(valueHtml.value);
  props.disable && editor.disable();
};

const handleChange = (editor) => {
  const isEmpty = editor.isEmpty();
  const html = isEmpty ? '' : editor.getHtml();
  valueHtml.value = html;
};

const handleFocus = (editor) => {
  console.log('focus', editor);
};

const handleBlur = (editor) => {
  const isEmpty = editor.isEmpty();
  const html = isEmpty ? '' : editor.getHtml();
  valueHtml.value = html;
};

const handleInsertText = (text) => {
  const editor = editorRef.value; // 获取 editor ，必须等待它渲染完之后
  if (isNull(editor) || isNull(text)) return;
  // 光标失焦前的位置
  editor.focus();
  // editor.focus(true);// 始终定位到最后
  editor.insertText(text); // 执行 editor API
};

const handleInsertHtml = (html) => {
  const editor = editorRef.value; // 获取 editor ，必须等待它渲染完之后
  if (isNull(editor) || isNull(html)) return;
  editor.setHtml(html); // 执行 editor API
};
defineExpose({ handleChange, handleFocus, handleBlur, handleInsertText, handleInsertHtml, html: valueHtml });
</script>
