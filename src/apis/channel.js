import { post, deleteFn, get } from '@/service';

export const channelList = (data) => {
  return post('/channel-account/list', data);
};

export const channelDelete = (data) => {
  return deleteFn('/channel-account/delete', data);
};

export const channelDetail = (data) => {
  return get('/channel-account/query', data);
};

export const channelSave = (data) => {
  return post('/channel-account/save', data);
};

export const channelAccount = (data) => {
  return get('/channel-account/queryByChannelType', data);
};
