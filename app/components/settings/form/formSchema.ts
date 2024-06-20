import { TTranslateFn } from '@/app/lib/types';
import { z } from 'zod';

export const getSettingsUpdateSchema = (t: TTranslateFn) =>
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

export const getSettingsCreateSchema = (t: TTranslateFn) =>
    getSettingsUpdateSchema(t).omit({ id: true });
