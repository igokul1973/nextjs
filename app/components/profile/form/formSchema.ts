import { TTranslateFn } from '@/app/lib/types';
import { getFileSchema } from '@/app/lib/utils';
import { z } from 'zod';

export const MAX_UPLOAD_SIZE = 1024 * 100; // 100KB
export const ACCEPTED_FILE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
];

export const getAvatarUpdateSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        name: z.string().min(5, { message: t('must be at least characters', { count: 5 }) }),
        size: z.coerce.number().gt(0, { message: t('must be greater than', { count: 0 }) }),
        type: z.string().min(1),
        data: getFileSchema(
            t,
            ACCEPTED_FILE_TYPES,
            'file must be a PNG, JPG, JPEG, WEBP or SVG image',
            MAX_UPLOAD_SIZE
        ),
        url: z.string().min(20, { message: t('must be greater than', { count: 0 }) }),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getAvatarCreateSchema = (t: TTranslateFn) =>
    getAvatarUpdateSchema(t).omit({ id: true, url: true });

const getBaseProfileSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        firstName: z
            .string({
                required_error: t('please enter the first name'),
                invalid_type_error: t('please enter the first name')
            })
            .min(1, { message: t('please enter the first name') }),
        lastName: z
            .string({
                required_error: t('please enter the last name'),
                invalid_type_error: t('please enter the last name')
            })
            .min(1, { message: t('please enter the last name') }),
        middleName: z.string().nullish(),
        userId: z.string({
            required_error: t('please enter the user ID'),
            invalid_type_error: t('please enter the user ID')
        }),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getProfileCreateSchema = (t: TTranslateFn) =>
    getBaseProfileSchema(t)
        .omit({ id: true })
        .extend({
            avatar: getAvatarCreateSchema(t).nullable()
        });

export const getProfileUpdateSchema = (t: TTranslateFn) =>
    getBaseProfileSchema(t).extend({
        avatar: getAvatarUpdateSchema(t).nullable()
    });

export const getProfileUpdateSchemaEmptyAvatar = (t: TTranslateFn) =>
    getBaseProfileSchema(t).extend({
        avatar: getAvatarCreateSchema(t).nullable()
    });
