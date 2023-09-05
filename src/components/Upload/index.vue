<template>
  <div class="upload-container">
    <component
      :is="isDragger ? 'a-upload-dragger' : 'a-upload'"
      v-bind="$attrs"
      :multiple="multiple"
      :accept="accept"
      :beforeUpload="beforeFileUpload"
      :maxCount="maxCount"
      :name="name"
      v-model:fileList="fileList"
      :action="action"
      @change="uploadChange"
    >
      <template v-if="isDefaultButton">
        <template v-if="isDragger"><DraggerDom></DraggerDom></template>
        <template v-else><ClickDom></ClickDom></template>
      </template>
      <template v-else>
        <slot name="uploadButton"></slot>
      </template>

      <!-- 自定义上传 -->
      <template #itemRender="{ file }">
        <div class="upload-item" v-if="isUploadItemRender">
          <div class="upload-item-content">
            <span :style="file.status === 'exception' ? 'color: red' : ''">{{ file.name }}</span>
            <div class="action-button">
              <a href="javascript:;" @click="handleRemove">删除{{ file.percent }}</a>
              <a href="javascript:;" class="margin-left-10" @click="handleResume" v-if="file.status === 'exception'">继续上传</a>
            </div>
          </div>
          <a-progress
            size="small"
            :stroke-color="{
              from: '#108ee9',
              to: '#87d068'
            }"
            :percent="file.percent"
            v-if="file.percent !== 0 && file.percent !== 100"
          />
        </div>
        <template v-else>
          <slot name="uploadItemRender"></slot>
        </template>
      </template>
    </component>
  </div>
</template>

<script setup lang="jsx">
import { computed, useSlots, defineExpose, ref } from 'vue';
import { isNull } from '@/utils/utils';
import { message } from 'ant-design-vue';
import axios from 'axios';
import _ from 'lodash';

const props = defineProps({
  trigger: {
    type: String,
    default: 'dragger' //上传方式：click/dragger
  },
  multiple: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 1 // 文件大小,单位M
  },
  shardSize: {
    type: Number,
    default: 200 // 分片大小，单位字节(KB)
  },
  accept: {
    type: String,
    default: null // 文件类型
  },
  beforeUpload: {
    type: Promise,
    default: null
  },
  maxCount: {
    type: Number,
    default: null
  },
  checkRequest: {
    type: Promise,
    default: null // 分片上传之前校验未成功上传的
  },
  shardRequest: {
    type: Promise,
    default: null // 不走action自动上传，isAutoUpload必须为true，分片上传
  },
  request: {
    type: Promise,
    default: null // 不走action自动上传，isAutoUpload必须为true，不分片上传
  },
  mergeShardRequest: {
    type: Promise,
    default: null // 分片上传完成之后合并分片
  },
  name: {
    type: String,
    default: 'file', // 后端接收文件的参数
    require: true
  },
  isCustomUpload: {
    type: Boolean,
    // 组件调用方自己上传，组件暴露出文件列表，包括已分片的，比如和form表单的其他内容一起提交等场景
    default: false
  },
  isAutoUpload: {
    type: Boolean,
    default: true // 是否自动上传，和action搭配使用
  },
  action: {
    type: String, // action自动上传，isAutoUpload必须是true
    default: null
  }
});

const shardList = ref([]); // 所有分片数据
const fileList = ref([]); // 文件上传列表
const isDragger = computed(() => props.trigger === 'dragger'); // 是否是拖拽上传
const isDefaultButton = !useSlots().uploadButton; // 是否自定义点击按钮
const isUploadItemRender = !useSlots().uploadItemRender; // 是否自定义上传列表
let config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  transformRequest: [
    function (data) {
      return data;
    }
  ],
  onUploadProgress: (progressEvent) => {
    let persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //上传进度百分比
    console.log(persent);
  }
};

// 点击上传按钮DOM
const ClickDom = (
  <a-button>
    <upload-outlined></upload-outlined>
    点击上传
  </a-button>
);

// 拖拽上传按钮DOM
const DraggerDom = (
  <>
    <p class='ant-upload-drag-icon'>
      <inbox-outlined></inbox-outlined>
    </p>
    <p class='ant-upload-text'>点击 或 拖拽文件到框内上传</p>
    <p class='ant-upload-hint'>{`${
      props.multiple ? `多文件${!isNull(props.maxCount) ? `,最多只能上传${props.maxCount}` : ''}` : '单文件'
    }上传，文件大小不超过${props.size}M，支持${!isNull(props.accept) ? props.accept : '所有文件(*.*)'}文件上传。`}</p>
  </>
);

// 上传文件之前校验文件大小等操作
const beforeFileUpload = (file, fileList) => {
  // 使用者自定义beforeUpload
  if (props.beforeUpload) {
    props.beforeUpload(file, fileList);
    return false;
  }

  // 校验文件大小和数量;
  return new Promise((resolve) => {
    try {
      updateFileList({ file, percent: 0 });
      // 校验文件大小是否符合要求
      if (!isNull(props.size) && !(file.size / 1024 / 1024 <= props.size)) {
        message.error(`上传文件不能大于大于${props.size}M!`);
        return false;
      }

      // 文件数量
      if (props.multiple && !isNull(props.maxCount) && fileList.length > props.maxCount) {
        message.error(`只能上传${props.maxCount}个文件！`);
        return false;
      }

      // action主动上传
      return resolve(!props.isAutoUpload);
    } catch (error) {
      console.error('components-upload-beforeFileUpload', error);
      return false;
    }
  });
};

// 上传文件改变
const uploadChange = async (file) => {
  try {
    console.log('file', file);
    const size = file.file.size;
    const shardSize = 1024 * props.shardSize;
    const count = Math.ceil(size / shardSize); // 总片数
    let shardArr = Array.from({ length: count }, (v, i) => i + 1);

    if (count === 1) {
      await upload({ file });
    }

    if (count > 1) {
      let needUpload = await checkFileUpload({ shardArr });
      shardArr = Array.isArray(needUpload) && needUpload.length > 0 ? needUpload : shardArr;
      await shardUpload({ shardArr, shardSize, file: file.file, size, count });
    }
  } catch (error) {
    console.error('components-upload-uploadChange', error);
  }
};

// 上传;
const upload = (options) => {
  const { file } = options || {};
  return new Promise(async (resolve, reject) => {
    try {
      const fileInfo = {
        [props.name || 'file']: file,
        count: 1,
        fileName: file?.name
      };
      // FIXME:调用方自己获取文件片段上传
      if (props.isCustomUpload) {
        shardList.value.push({ ...fileInfo });
        resolve(true);
      }
      // 直接在组件中上传，非action上传
      const formData = getFormData({ ...fileInfo });
      // TODO:props.request && (await props.request(formData, {...config}));
      // FIXME:上传成功修改fileList
      updateFileList({ file });
    } catch (error) {
      reject(error);
      updateFileList({ file, status: 'exception' });
    }
  });
};

// 断点续传检查已上传完成的分片
const checkFileUpload = async (options) => {
  try {
    const { shardArr } = options || {};
    // 已经上传的
    const uploadedInfo = (await props.checkRequest) && props.checkRequest({});
    return _.xor(shardArr, uploadedInfo?.data);
  } catch (error) {
    console.error('components-upload-checkFileUpload', error);
  }
};

// 分片上传
const shardUpload = (options) => {
  const { shardArr, shardSize, file, size, count } = options || {};
  let number = 0;
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < shardArr.length; i++) {
        //开始位置      每一次循环的开始位置
        const start = i * shardSize;
        // 结束位置      取最小值    如 378，0+200取200  378,200+200取378
        const end = Math.min(size, start + shardSize);

        //切片   slice 使用slice方法对文件进行分割
        const shardFile = file?.slice(start, end);

        const fileInfo = {
          [props.name || 'file']: shardFile,
          count: shardArr[i],
          fileName: file?.name
        };

        // FIXME:调用方自己获取文件片段上传
        if (props.isCustomUpload) {
          shardList.value.push({ ...fileInfo });
          resolve(true);
        }

        // 直接在组件中上传，非action上传
        const formData = getFormData({ ...fileInfo });
        const uploadResult = props.shardRequest && (await props.shardRequest(formData, { ...config }));
        console.log('uploadResult', uploadResult);
        // 每一片上传成功更新进度
        number++;
        // updateFileList({ file, percent: number / count, status: 'active' });
        // // TODO:最后一片上传成功，开始合并
        // // props.mergeShardRequest && (await props.mergeShardRequest({}));
        // // FIXME:最后一片上传成功修改fileList
        // updateFileList({ file, status: 'success' });
      }
    } catch (error) {
      reject(error);
      updateFileList({ file, status: 'exception', percent: number / count });
    }
  });
};

// FormData数据
const getFormData = (options) => {
  const { file, count, fileName, number } = options || {};
  const formData = new FormData();
  // FIXME:根据后端接口更新
  formData.append(props.name || 'file', file);
  formData.append('count', count);
  formData.append('fileName', fileName);
  formData.append('number', number);
  return formData;
};

// 上传成功更新fileList
const updateFileList = (options) => {
  const { file, status = 'success', percent = 100 } = options || {};
  const index = _.findIndex(fileList.value, (item) => item?.uid === file?.uid);
  fileList.value.splice(index, 1, {
    percent,
    name: file.name,
    status
  });
};

// 删除图片
const handleRemove = () => {};

// 继续上传
const handleResume = () => {};

defineExpose({ fileList: fileList.value, shardList: shardList.value });
</script>

<style lang="less" scoped>
.upload-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  .upload-item-content {
    width: 100%;
    display: flex;
    align-items: center;
    span {
      flex: 1;
    }
    .action-button {
      width: 100px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
