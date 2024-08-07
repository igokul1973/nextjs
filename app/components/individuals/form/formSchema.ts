import {
    emailsFormSchema,
    getAddressFormSchema,
    getAttributesFormSchema,
    getPhonesFormSchema
} from '@/app/lib/data/common-form-schemas';
import { TTranslateFn } from '@/app/lib/types';
import { getFileSchema, isValidDate } from '@/app/lib/utils';
import dayjs from 'dayjs';
import { z } from 'zod';

export const MAX_UPLOAD_SIZE = 1024 * 100; // 100KB
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

export const getLogoUpdateSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        name: z.string().min(5, { message: t('must be at least characters', { count: 5 }) }),
        size: z.coerce.number().gt(0, { message: t('must be greater than', { count: 0 }) }),
        type: z.string().min(1),
        data: getFileSchema(
            t,
            ACCEPTED_FILE_TYPES,
            'file must be a PNG, JPG, JPEG or SVG image',
            MAX_UPLOAD_SIZE
        ),
        url: z.string().min(20, { message: t('must be greater than', { count: 0 }) }),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getLogoCreateSchema = (t: TTranslateFn) =>
    getLogoUpdateSchema(t).omit({ id: true, url: true });

const getBaseIndividualFormSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        code: z
            .string()
            .max(50, { message: t('must be less than characters', { count: 50 }) })
            .nullish(),
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
        accountId: z.string(),
        localIdentifierNameId: z.string(),
        localIdentifierValue: z.string().nullish(),
        accountRelation: z.string(),
        dob: isValidDate('invalid date')
            .nullish()
            .transform((val) => {
                if (dayjs.isDayjs(val)) {
                    return val.toDate();
                }
                return val;
            }),
        description: z.string().nullish(),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getCustomerIndCreateSchema = (t: TTranslateFn) =>
    getBaseIndividualFormSchema(t)
        .omit({ id: true })
        .extend({
            logo: getLogoCreateSchema(t).nullish(),
            address: getAddressFormSchema(t).omit({ id: true }),
            phones: getPhonesFormSchema(t).element.omit({ id: true }).array(),
            emails: emailsFormSchema(t).element.omit({ id: true }).array(),
            attributes: getAttributesFormSchema(t)
        });

export const getProviderIndCreateSchema = (t: TTranslateFn) =>
    getCustomerIndCreateSchema(t).omit({ code: true });

export const getProviderIndUpdateSchema = (t: TTranslateFn) =>
    getBaseIndividualFormSchema(t).extend({
        logo: getLogoUpdateSchema(t).nullish(),
        address: getAddressFormSchema(t),
        phones: getPhonesFormSchema(t),
        emails: emailsFormSchema(t),
        attributes: getAttributesFormSchema(t)
    });

export const getProviderIndUpdateSchemaEmptyLogo = (t: TTranslateFn) =>
    getBaseIndividualFormSchema(t).extend({
        logo: getLogoCreateSchema(t).nullish(),
        address: getAddressFormSchema(t),
        phones: getPhonesFormSchema(t),
        emails: emailsFormSchema(t),
        attributes: getAttributesFormSchema(t)
    });

export const getCustomerIndUpdateSchema = (t: TTranslateFn) =>
    getProviderIndUpdateSchema(t).extend({
        customerId: z
            .string({
                required_error: t('customer ID is missing')
            })
            .min(1, { message: t('customer ID is missing') })
    });

export const getCustomerIndUpdateSchemaEmptyLogo = (t: TTranslateFn) =>
    getProviderIndUpdateSchemaEmptyLogo(t).extend({
        customerId: z
            .string({
                required_error: t('customer ID is missing')
            })
            .min(1, { message: t('customer ID is missing') })
    });
