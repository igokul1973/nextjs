import { TTranslateFn } from '@/app/lib/types';
import { UserRoleEnum } from '@prisma/client';
import { z } from 'zod';
import { userRoles } from './constants';

export const getUserRegistrationSchema = (t: TTranslateFn) => {
    return z.object({
        email: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 6 }) })
            .email(t('please enter a valid email address')),

        countryCode: z.preprocess(
            (value) => {
                return typeof value === 'string' && value.startsWith('+') ? value.slice(1) : value;
            },
            z
                .string({
                    required_error: t('please enter the country code'),
                    invalid_type_error: t('please enter the country code')
                })
                .min(1, { message: t('please enter the country code') })
                .max(3, { message: t('the country code cannot be bigger than 999') })
        ),
        number: z.coerce
            .string({
                required_error: t('please enter the phone number'),
                invalid_type_error: t('please enter the phone number')
            })
            .min(8, { message: t('the phone number cannot have less than 8 digits') })
            .max(14, {
                message: t('the phone number cannot have more than 14 digits')
            }),
        isActive: z.boolean(),
        role: z.enum(userRoles, {
            invalid_type_error: t('please enter the user role')
        })
    });
};

export const getDefaultValues = (email = '') => {
    return {
        email,
        countryCode: '',
        number: '',
        isActive: true,
        role: UserRoleEnum.writer
    };
};
