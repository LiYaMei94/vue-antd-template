import { post, deleteFn, get, put } from '@/service';

export const mouldList = (data) => {
  return post('/message-template/list', data);
};

export const mouldDelete = (data) => {
  return deleteFn('/message-template/delete', data);
};

export const mouldDetail = (data) => {
  return get('/message-template/query', data);
};

export const mouldSave = (data) => {
  return post('/message-template/save', data, { skipHandleResponse: true });
};

export const templateVariableList = (data) => {
  return post('/template-variable/list', data);
};

export const templateVariableSave = (data) => {
  return post('/template-variable/save', data);
};

export const templateVariableDelete = (data) => {
  return post('/template-variable/delete', data);
};

export const miniTempList = (data) => {
  return get('/mini-program/template/list', data);
};

export const miniTempDetail = (data) => {
  return get('/mini-program/detailTemplate', data);
};

export const updateMouldStatus = ({ id, checked }) => {
  const status = checked ? 'start' : 'stop';
  return put(`/message-template/${status}`, { id });
};
