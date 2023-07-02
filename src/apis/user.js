import { post, get } from '@/service';

export const login = (data) => {
  return post('/sysAdmin/login', data, { skipHandleResponse: true });
};

export const logout = (data) => {
  return post('/sysAdmin/logout', data, { skipHandleResponse: true });
};

export const code = (data) => {
  return get('/sysAdmin/captchaImage', data, { skipHandleResponse: true });
};
