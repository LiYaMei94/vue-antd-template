import { post } from '@/service';
import db from '@/utils/db';

const DB = new db();

export const allEnum = (data) => {
  return post('/enum/getAll', data);
};
