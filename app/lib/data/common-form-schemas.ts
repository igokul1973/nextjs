import { z } from 'zod';
import { TTranslateFn } from '../types';

export const getAddressFormSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string().optional(),
        addressLine1: z
            .string({
                required_error: t('please enter the street address'),
                invalid_type_error: t('please enter the street address')
            })
            .min(2, { message: t('please enter the street address') }),
        addressLine2: z.string().nullish(),
        addressLine3: z.string().nullish(),
        locality: z
            .string({
                required_error: t('please enter the city/village/locality'),
                invalid_type_error: t('please enter the city/village/locality')
            })
            .min(2, { message: t('please enter the city/village/locality') }),
        region: z.string().nullish(),
        postcode: z
            .string({
                required_error: t('please enter the zip/postal code'),
                invalid_type_error: t('please enter the zip/postal code')
            })
            .min(4, { message: t('please enter the zip/postal code') }),
        countryId: z
            .string({
                required_error: t('please enter the country'),
                invalid_type_error: t('please enter the country')
            })
            .min(10, { message: 'please enter the country' }),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getPhonesFormSchema = (t: TTranslateFn) =>
    z
        .array(
            z.object({
                id: z.string().optional(),
                countryCode: z.preprocess(
                    (value) => {
                        return typeof value === 'string' && value.startsWith('+')
                            ? value.slice(1)
                            : value;
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
                type: z
                    .string({
                        required_error: t('please enter the phone type'),
                        invalid_type_error: t('please enter the phone type')
                    })
                    .min(2, { message: t('please enter the phone type') }),
                createdBy: z.string(),
                updatedBy: z.string()
            })
        )
        .min(1, { message: 'please enter the phone number' });

export const emailsFormSchema = (t: TTranslateFn) =>
    z
        .array(
            z.object({
                id: z.string().optional(),
                email: z
                    .string({
                        required_error: t('please enter the email address'),
                        invalid_type_error: t('please enter the email address')
                    })
                    .email({ message: t('please enter a valid email address') }),
                type: z
                    .string({
                        required_error: t('please enter the email type'),
                        invalid_type_error: t('please enter the email type')
                    })
                    .min(2, { message: t('please enter the email type') }),
                createdBy: z.string(),
                updatedBy: z.string()
            })
        )
        .min(1, { message: t('please enter the email address') });

export const getAttributesFormSchema = (t: TTranslateFn) =>
    z.array(
        z.object({
            type: z
                .string({
                    required_error: t('please enter the attribute type'),
                    invalid_type_error: t('please enter the attribute type')
                })
                .min(4, { message: t('please enter the attribute type') }),
            name: z
                .string({
                    required_error: t('please enter the attribute name'),
                    invalid_type_error: t('please enter the attribute name')
                })
                .min(1, { message: t('please enter the attribute name') }),
            value: z
                .string({
                    required_error: t('please enter the attribute value'),
                    invalid_type_error: t('please enter the attribute value')
                })
                .min(1, { message: t('please enter the attribute value') }),
            createdBy: z.string(),
            updatedBy: z.string()
        })
    );
