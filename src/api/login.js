import { post } from '@/service';

export const login = data => {
  return post('xxxx', data, { skipHandleResponse: true });
};