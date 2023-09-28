import { post, get, upload, deleteFn, download } from '@/lib/axios';

// 校验已上传分片
export const checkUploadTask = (data, config) => {
  return get('/v1/part-file/checkUploadTask', data, config);
};

// 添加分片初始化任务
export const addShardTask = (data, config) => {
  return post('/v1/part-file', data, config);
};

// 分片上传
export const uploadShard = (data, config) => {
  return upload('/v1/part-file/uploadPart', data, config);
};

// 合并分片
export const mergeShard = (data, config) => {
  return get('/v1/part-file/merge', data, config);
};

// 删除文件
export const fileDelete = (data, config) => {
  return deleteFn('/v1/single-file/delete', data, config);
};

// 上传文件
export const uploadFile = (data, config) => {
  return upload('/v1/single-file/upload', data, config);
};

// 视频下载 [不需要加密]
export const videoFileDownload = (data) => {
  return download('/v1/download/video', data);
};

// 加密文件下载
export const encodeFileDownload = (data) => {
  return download('/v1/download/document', data);
};

// 不加密文件下载
export const fileDownload = (data) => {
  return download('/v1/download/preview', data);
};
