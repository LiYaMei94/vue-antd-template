import SparkMD5 from 'spark-md5';

// 获取文件MD5
export const getFileMD5 = (file) => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      spark.append(e.target.result);
      resolve(spark.end());
    };
    fileReader.onerror = () => {
      reject('');
    };
    fileReader.readAsArrayBuffer(file);
  });
};

// 获取字符串MD5
export const getHashMD5 = (str) => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5();
    spark.append(str);
    resolve(spark.end());
  });
};

// 获取视频|音频时长
export const getDuration = (file) => {
  return new Promise((resolve, reject) => {
    try {
      let url = URL.createObjectURL(file);
      console.log('file', file, url);
      //经测试，发现audio也可获取视频的时长
      //生成一个html标签
      let audioElement = new Audio(url);
      audioElement.addEventListener('loadeddata', () => {
        // 得到视频或音频的时长，单位秒
        resolve(audioElement.duration.toFixed(2));
      });
    } catch (error) {
      reject(error);
      console.error('getDuration', error);
    }
  });
};

export const UPLOAD_STATUS_SUCCESS = 'success';
export const UPLOAD_STATUS_ERROR = 'error';
export const UPLOAD_STATUS_UPLOADING = 'uploading';
export const UPLOAD_STATUS_STOP = 'stop';
export const UPLOAD_STATUS_DONE = 'done';
export const UPLOAD_STATUS_ENUM = [
  {
    label: '上传成功',
    value: UPLOAD_STATUS_SUCCESS,
    color: 'success',
    icon: 'check-circle-outlined'
  },
  {
    label: '上传失败',
    value: UPLOAD_STATUS_ERROR,
    color: 'error',
    icon: 'close-circle-outlined'
  },
  {
    label: '上传中',
    value: UPLOAD_STATUS_UPLOADING,
    color: 'processing',
    icon: 'sync-outlined',
    spin: true
  },
  {
    label: '已暂停',
    value: UPLOAD_STATUS_STOP,
    color: 'default',
    icon: 'minus-circle-outlined'
  },
  {
    label: '已完成',
    value: UPLOAD_STATUS_DONE,
    color: 'default',
    icon: 'check-circle-outlined'
  }
];
