<template>
  <Editor :id="tinymceId" v-model="myValue" :init="init" :disabled="disabled"></Editor>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { buildShortUUID } from '@/utils/utils';

import tinymce from 'tinymce/tinymce'; //tinymce默认hidden，
import Editor from '@tinymce/tinymce-vue'; //编辑器引入
import 'tinymce/themes/silver/theme'; //编辑器主题
import 'tinymce/icons/default'; //引入编辑器图标icon
import 'tinymce/plugins/advlist'; //高级列表
import 'tinymce/plugins/autolink'; //自动链接
import 'tinymce/plugins/link'; //超链接
import 'tinymce/plugins/image'; //插入编辑图片
import 'tinymce/plugins/lists'; //列表插件
import 'tinymce/plugins/charmap'; //特殊字符
import 'tinymce/plugins/media'; //插入编辑媒体
import 'tinymce/plugins/wordcount'; // 字数统计
import 'tinymce/plugins/table';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/preview';

const props = defineProps({
  plugins: {
    type: [String, Array],
    default: 'advlist autolink link image lists charmap table fullscreen imagetools preview'
  },
  toolbar: {
    type: [String, Array],
    default:
      'undo redo |  formatselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent lists image | fullscreen | preview'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  tinymceId: {
    type: [String, Number],
    default: buildShortUUID('tinymceId')
  }
});

const myValue = ref('');
const fonts = ['宋体=宋体', '微软雅黑=微软雅黑'];
const init = {
  selector: '#tinymce',
  language_url: '/tinymce/langs/zh_CN.js', //汉化路径是自定义的，一般放在public或static里面
  language: 'zh_CN',
  skin_url: '/tinymce/skins/ui/oxide', //皮肤
  plugins: props.plugins, //插件
  //工具栏
  toolbar: props.toolbar,
  toolbar_location: '/',
  fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', //字体大小
  font_formats: fonts.join(';'), //引入字体如['宋体=宋体','微软雅黑=微软雅黑'],
  height: 500, //高度
  placeholder: '在这里输入盖伦好帅~',
  branding: false //隐藏右下角技术支持
};

onMounted(() => {
  tinymce.init({ ...init });
});
</script>
