import { EmailTypeEnum, PhoneTypeEnum } from '@prisma/client';

export const dateFormats = [
    'YYYY/MM/DD',
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY'
] as const;

export const phoneTypes = Object.values(PhoneTypeEnum) as [PhoneTypeEnum, ...PhoneTypeEnum[]];
export const emailTypes = Object.values(EmailTypeEnum) as [EmailTypeEnum, ...EmailTypeEnum[]];
