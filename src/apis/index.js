import { post } from '@/service';
import db from '@/utils/db';

const DB = new db();

export const allEnum = (data) => {
  return post('/enum/getAll', data);
};

export const getLocalAllEnum = async () => {
  try {
    const allEnumResult = DB.getLocal('allEnum') || (await allEnum({})).data;
    DB.setLocal('allEnum', allEnumResult);
    let channelTypeEnum = allEnumResult?.channelType || [];
    const idTypeEnum = allEnumResult?.idType || [];
    const msgTypeEnum = allEnumResult?.messageType || [];
    const templateStatusEnum = allEnumResult?.messageTemplateStatus || [];
    return {
      channelTypeEnum,
      idTypeEnum,
      msgTypeEnum,
      templateStatusEnum
    };
  } catch (error) {}
};
