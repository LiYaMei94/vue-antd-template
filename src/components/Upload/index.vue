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
      :disabled="disabled || (fileList.length >= maxCount && maxCount !== 1)"
    >
      <template v-if="isDefaultButton">
        <template v-if="isDragger"><DraggerDom></DraggerDom></template>
        <template v-else><ClickDom></ClickDom></template>
      </template>
      <template v-else>
        <slot name="uploadButton"></slot>
      </template>

      <!-- 自定义上传列表 -->
      <template #itemRender="{ file, fileList }">
        <!-- 组件调用方自定义 -->
        <template v-if="!isUploadItemRender">
          <slot name="uploadItemRender" :dataInfo="{ file, fileList }"></slot>
        </template>
      </template>
    </component>
    <!-- 组件内部自定义 -->
    <div class="custom-upload-list" v-if="isUploadItemRender">
      <div class="upload-item" v-for="(file, index) in fileList" :key="index">
        <div class="upload-item-left">
          <div
            :style="file?.status === UPLOAD_STATUS_ERROR ? 'color: var(--ant-error-color)' : 'color: var(--ant-primary-color)'"
            class="text-ellipsis file-name"
          >
            {{ file?.name || file?.file?.name }}
          </div>
          <div>
            <UploadStatus :file="file"></UploadStatus>
            <span v-if="!isNull(file?.size)">{{ Math.ceil(file?.size / 1024) }} KB</span>
            <span v-else>{{ Math.ceil(file?.file?.size / 1024) }} KB</span>
          </div>
          <a-progress
            size="small"
            :stroke-color="{
              from: '#108ee9',
              to: '#87d068'
            }"
            :percent="file?.percent"
            v-if="!isNull(file?.percent)"
          />
        </div>
        <div class="upload-item-right">
          <div class="action-button">
            <DeleteOutlined
              @click="handleRemove($event, file)"
              style="font-size: 20px; color: var(--ant-error-color)"
              v-if="getDeleteVisible(file)"
            />

            <a href="javascript:;" class="margin-left-10" @click="handleCancelUpload()" v-if="file?.status === UPLOAD_STATUS_UPLOADING">取消上传</a>

            <a
              href="javascript:;"
              class="margin-left-10"
              @click="handleResume($event, file)"
              v-if="file?.status === UPLOAD_STATUS_ERROR || file?.status === UPLOAD_STATUS_STOP"
            >
              继续上传
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { computed, useSlots, defineExpose, ref, onMounted, watch, onUnmounted } from 'vue';
import { isNull, filterEnum, isBoolean } from '@/utils/utils';
import { message, Modal } from 'ant-design-vue';
import axios from 'axios';
import _ from 'lodash';
import {
  getFileMD5,
  getHashMD5,
  getDuration,
  UPLOAD_STATUS_ENUM,
  UPLOAD_STATUS_SUCCESS,
  UPLOAD_STATUS_ERROR,
  UPLOAD_STATUS_UPLOADING,
  UPLOAD_STATUS_STOP
} from './index';
import { checkUploadTask, addShardTask, uploadShard, mergeShard, fileDelete, uploadFile } from '@/api/upload';

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
    default: 5 * 1024 // FIXME:最小必须是5M ，分片大小，单位字节(KB)
  },
  accept: {
    type: String,
    default: null // 文件类型
  },
  beforeUpload: {
    type: Promise,
    default: null
  },
  beforeUploadBack: {
    type: Function,
    default: null
  },
  maxCount: {
    type: Number,
    default: 1
  },
  defaultFileList: {
    type: Array, // 回显文件列表
    default: []
  },
  name: {
    type: String,
    default: 'file', // 后端接收文件的参数
    require: true
  },
  isAutoUpload: {
    type: Boolean,
    default: true // 是否自动上传，和action搭配使用
  },
  action: {
    type: String, // FIXME:action自动上传，isAutoUpload必须是false
    default: null
  },
  isEncode: {
    type: Boolean, // 是否加密
    default: false
  },
  disabled: {
    type: Boolean, // 是否禁止点击
    default: false
  },
  deleteFileRequest: {
    type: [Function, Boolean],
    default: null
  }
});

const fileList = ref([]); // 文件上传列表
const isDragger = computed(() => props.trigger === 'dragger'); // 是否是拖拽上传
const isDefaultButton = !useSlots().uploadButton; // 是否自定义点击按钮
const isUploadItemRender = !useSlots().uploadItemRender; // 是否自定义上传列表
// 终止请求
let requestSource = null;
let deleteRequestSource = null;
const continueUploadFile = [];
const progressList = [];

watch(
  () => props.defaultFileList,
  (newVal, oldVal) => {
    if (!_.isEqual(newVal, oldVal)) {
      fileList.value = newVal || [];
    }
  },
  { immediate: true, deep: true }
);

onUnmounted(() => {
  requestSource?.cancel('注意：用户已终止文件上传请求~');
  deleteRequestSource?.cancel('注意：用户已终止文件删除请求~');
});

// 上传状态DOM
const UploadStatus = (props) => {
  const { file } = props || {};
  const item = filterEnum(file?.status, UPLOAD_STATUS_ENUM, {}, 'group');
  const spin = file?.status === UPLOAD_STATUS_UPLOADING;
  return (
    !isNull(item) && (
      <a-tag color={item?.color || 'default'} icon={<MyIcon type={item?.icon} spin={spin} source='anticonfont'></MyIcon>}>
        {item?.label || ' '}
      </a-tag>
    )
  );
};

// 点击上传按钮DOM
const ClickDom = (
  <a-button>
    <upload-outlined></upload-outlined>
    点击上传
  </a-button>
);

// 是否显示删除
const getDeleteVisible = (file) => {
  const errorStatus = [UPLOAD_STATUS_ERROR, UPLOAD_STATUS_STOP];
  return props.maxCount === 1 ? errorStatus?.includes(file?.status) : [...UPLOAD_STATUS_ENUM]?.includes(file?.status);
};

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

// 上传文件之前校验文件大小、数量等操作
const beforeFileUpload = (file, fileList) => {
  props.beforeUploadBack && props.beforeUploadBack(file, fileList);

  // 组件调用方自定义beforeUpload
  if (props.beforeUpload) {
    props.beforeUpload(file, fileList);
    return false;
  }

  // 校验文件大小和数量;
  return new Promise((resolve) => {
    try {
      // 校验文件大小是否符合要求，file.size是字节(K)
      if (!isNull(props.size) && !(file.size / 1024 / 1024 <= props.size)) {
        message.error(`注意：上传的文件不能大于${props.size}M!`);
        return false;
      }

      // 文件数量，当maxCount是1时新文件覆盖旧文件，当maxCount>1时，已上传的文件超过maxCount时不能再上传
      if (!isNull(props.maxCount) && fileList.length >= props.maxCount && props.maxCount !== 1) {
        message.error(`注意：最多只能上传${props.maxCount}个文件！`);
        return false;
      }

      return resolve(!props.isAutoUpload);
    } catch (error) {
      console.error('components-upload-beforeFileUpload', error);
      return false;
    }
  });
};

// 上传文件改变
const uploadChange = async (file) => {
  continueUploadFile.push(file.file);
  updateFileList({ file: file.file, status: UPLOAD_STATUS_UPLOADING, percent: 0 });
  upload(file.file);
};

// 上传
const upload = async (file) => {
  const { size, name, uid } = file || {};
  requestSource = axios.CancelToken.source();
  try {
    const shardSize = 1024 * props.shardSize; // 分片大小，单位字节(K)
    const count = Math.ceil(size / shardSize); // 总片数
    let shardArr = Array.from({ length: count }, (v, i) => i + 1); // 分片序号数组

    // 一个分片直接上传
    if (count === 1) {
      await fileUpload({ file });
      return;
    }

    // 分片数大于1，开启分片上传
    let identifier = await getFileMD5(file); // 文件MD5
    identifier = await getHashMD5(`${identifier}-${name}`); // FIXME:文件MD5 + 文件名称MD5，确保修改文件名称后可以上传

    // 检查已经上传的分片
    let checkResult = await checkFileUpload({ shardArr, identifier, file, size, name });
    console.log('checkResult', checkResult);

    if (checkResult?.finished) {
      return;
    }

    let fileId = checkResult?.fileId; // 不是初次上传、但没上传完成
    let taskId = checkResult?.taskId;

    // 当前文件第一次上传，初始分片任务
    if (isNull(checkResult)) {
      const duration = await getDuration(file); // 文件时长
      console.log('duration', duration);
      const newTaskInfo = await addShardTask(
        { identifier, totalSize: size, chunkSize: shardSize, fileName: name, duration },
        {
          cancelToken: requestSource?.token
        }
      );
      // FIXME:获取任务id
      taskId = newTaskInfo?.data?.taskRecord?.id;
    }

    // 分片上传
    await shardUpload({
      shardArr: checkResult?.upload || shardArr,
      shardSize,
      file,
      count,
      fileId,
      taskId,
      exitPartList: checkResult?.exitPartList,
      identifier,
      size,
      name
    });
  } catch (error) {
    console.error('components-upload-uploadChange', error);
    updateFileList({ size, name, uid, status: UPLOAD_STATUS_ERROR });
  }
};

// 上传;
const fileUpload = (options) => {
  const { file } = options || {};
  return new Promise(async (resolve, reject) => {
    try {
      const fileInfo = {
        [props.name || 'file']: file
      };
      let percent = 0;
      const formData = getFormData({ ...fileInfo });
      const result = await uploadFile(
        formData,
        {
          onUploadProgress: (progressEvent) => {
            percent = progressEvent.loaded / progressEvent.total; //上传进度百分比
          }
        },
        {
          cancelToken: requestSource?.token
        }
      );
      // FIXME:上传成功修改fileList
      updateFileList({ ...options, ...result?.data, status: UPLOAD_STATUS_SUCCESS, percent });
    } catch (error) {
      reject(error);
      updateFileList({ ...options, status: UPLOAD_STATUS_ERROR });
      console.error('components-upload-upload', error);
    }
  });
};

// 断点续传检查已上传完成的分片
const checkFileUpload = async (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { shardArr = [], identifier, file } = options || {};
      // 获取已经上传的
      const uploadedInfo = await checkUploadTask(
        { identifier },
        {
          cancelToken: requestSource?.token
        }
      );
      const { taskRecord, finished, fileId } = uploadedInfo?.data || {};
      const uploadedShardNum = _.map(taskRecord?.exitPartList, 'partNumber');
      const xor = _.xor(shardArr, uploadedShardNum); // 全部分片序号和已上传的分片做差集

      // 文件已上传完成，后端直接返回成功状态和fileId
      if (finished) {
        updateFileList({
          ...options,
          ...taskRecord,
          fileId: fileId,
          status: UPLOAD_STATUS_SUCCESS,
          percent: 100
        });
        return resolve({ finished, fileId });
      }

      // 有已上传的且文件没传完
      if (!finished && !isNull(uploadedInfo?.data)) {
        // 返回已经上传、未上传的
        return resolve({
          upload: xor?.length ? xor : shardArr,
          fileId: fileId || taskRecord?.id,
          taskId: fileId || taskRecord?.id,
          exitPartList: taskRecord?.exitPartList,
          finished
        });
      }

      // 该文件没有上传过
      if (isNull(uploadedInfo?.data)) {
        resolve(null);
      }
    } catch (error) {
      console.error('components-upload-checkFileUpload', error);
      return reject(error);
    }
  });
};

// 分片上传
const shardUpload = (options) => {
  const { shardArr = [], shardSize, file, count, fileId, taskId, exitPartList = [], identifier } = options || {};
  const { size } = file || {};
  let uploadedArr = exitPartList;
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < shardArr?.length; i++) {
        //开始位置，每一次循环的开始位置
        const start = i * shardSize;
        // 结束位置，取最小值
        const end = Math.min(size, start + shardSize);

        //切片，slice 使用slice方法对文件进行分割
        const shardFile = file?.slice(start, end);

        const fileInfo = {
          [props.name || 'file']: shardFile,
          fileId,
          partNumber: shardArr[i],
          taskId
        };

        const formData = getFormData({ ...fileInfo });
        let percent = 0;

        // 上传每一个分片
        const uploadResult = await uploadShard(formData, {
          cancelToken: requestSource?.token
        });

        // 每一片上传成功更新进度
        !uploadedArr?.includes(shardArr[i]) && uploadedArr.push(shardArr[i]);
        updateFileList({ ...options, percent: uploadedArr?.length / count, size, status: UPLOAD_STATUS_UPLOADING });

        if (uploadedArr?.length === count) {
          // 最后一片上传成功，开始合并
          const fileInfo = await mergeShard(
            { identifier },
            {
              cancelToken: requestSource?.token
            }
          );
          // FIXME:最后一片上传成功修改fileList
          updateFileList({ ...options, ...fileInfo?.data, percent: 1, size, status: UPLOAD_STATUS_SUCCESS });
        }
      }
    } catch (error) {
      console.error('components-upload-shardUpload', error);
      reject(error);
      updateFileList({ ...options, percent: uploadedArr?.length / count, size, status: UPLOAD_STATUS_ERROR });
    }
  });
};

// FormData数据
const getFormData = (options) => {
  const { file, fileId, partNumber } = options || {};
  const formData = new FormData();
  // FIXME:根据后端接口更新
  for (let key in options) {
    formData.append(key, options[key]);
  }
  return formData;
};

// 上传时更新fileList
const updateFileList = (options) => {
  try {
    console.log('updateFileList-options', options);
    const { percent = 0, fileId, file } = options || {};
    const { uid, size } = file || {};
    const index = _.findIndex(fileList.value, (item) => {
      return item?.fileId === fileId || item?.uid === uid || item?.file?.uid === uid;
    });

    console.log('updateFileList-index', index);

    if (index !== -1) {
      fileList.value.splice(index, 1, {
        ...options,
        percent: percent?.toFixed(2) * 100
      });
    }
  } catch (error) {
    console.error('components-upload-updateFileList', error);
  }
};

// 删除
const handleRemove = async (event, options) => {
  const { fileId, uid, status } = options || {};
  deleteRequestSource = axios.CancelToken.source();
  Modal.confirm({
    title: '文件删除',
    content: `${status === UPLOAD_STATUS_UPLOADING ? '当前文件正在上传中，是否终止并删除？' : '确认要删除吗？'}`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        if (status === UPLOAD_STATUS_UPLOADING) {
          requestSource?.cancel('注意：用户已终止文件上传请求~');
        }

        if (!isNull(fileId)) {
          const deleteAPI = props?.deleteFileRequest || fileDelete;
          await deleteAPI({ fileId });
        }

        const index = _.findIndex(fileList.value, (item) => {
          if (!isNull(fileId)) return item?.fileId === fileId;
          return item?.uid === uid;
        });
        fileList.value.splice(index, 1);
      } catch (error) {
        console.error('components-upload-handleRemove', error);
      }
    }
  });
};

// 取消、暂停
const handleCancelUpload = () => {
  requestSource?.cancel('注意：用户已终止文件上传请求~');
};

// 继续上传
const handleResume = (event, options) => {
  const { fileId, uid, file } = options || {};
  const index = _.findIndex(fileList.value, (item) => item?.uid === uid);
  if (index === -1) {
    message.error('找不到文件~');
    return;
  }
  upload(continueUploadFile[index]);
};

defineExpose({ fileList });
</script>

<style lang="less" scoped>
.upload-container {
  .custom-upload-list {
    .upload-item:nth-of-type(1) {
      margin-top: 10px;
    }
    .upload-item {
      display: flex;
      align-items: center;
      flex-direction: row;
      border-radius: 10px;
      margin-bottom: 10px;
      padding: 5px 0 5px 10px;
      border: 1px dashed var(--private-border-color);
      .upload-item-left {
        flex: 1;
        margin-right: 20px;
        text-align: left;
        .file-name {
          font-size: 14px;
          margin-bottom: 12px;
        }
      }
      .upload-item-right {
        width: 140px;
      }
    }
  }
}
</style>
