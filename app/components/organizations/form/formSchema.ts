import {
    addressFormSchema,
    attributesFormSchema,
    emailsFormSchema,
    phonesFormSchema
} from '@/app/lib/data/common-form-schemas';
import { TTranslateFn } from '@/app/lib/types';
import { z } from 'zod';

const validateBEFile = (file: object | undefined) => {
    return !!file && 'lastModified' in file && 'name' in file && file instanceof Blob;
};

export const MAX_UPLOAD_SIZE = 1024 * 200; // 200KB
export const ACCEPTED_FILE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
];

const getFileSchema = (t: TTranslateFn) =>
    z
        .instanceof(typeof File === 'undefined' ? Blob : File)
        .refine(
            (file) => {
                if (!file) {
                    return true;
                } else if (
                    (typeof File !== 'undefined' && !(file instanceof File)) ||
                    (typeof File === 'undefined' && !validateBEFile(file))
                ) {
                    return false;
                }
                return file.size <= MAX_UPLOAD_SIZE;
            },
            t('file size must be less than kb', { count: MAX_UPLOAD_SIZE })
        )
        .refine((file) => {
            if (!file) {
                return true;
            } else if (
                (typeof File !== 'undefined' && !(file instanceof File)) ||
                (typeof File === 'undefined' && !validateBEFile(file))
            ) {
                return false;
            }
            return ACCEPTED_FILE_TYPES.includes(file.type);
        }, t('file must be a PNG, JPG, JPEG, WEBP, or SVG image'))
        .transform((val, ctx) => {
            if (
                (val !== null && typeof File !== 'undefined' && !(val instanceof File)) ||
                (typeof File === 'undefined' && !validateBEFile(val))
            ) {
                ctx.addIssue({
                    code: 'invalid_type',
                    expected: 'object',
                    received: typeof val
                });
                return z.NEVER;
            }
            return val;
        });

export const getLogoUpdateSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        name: z.string().min(5, { message: t('must be at least characters', { count: 5 }) }),
        size: z.coerce.number().gt(0, { message: t('must be greater than', { count: 0 }) }),
        type: z.string().min(1),
        data: getFileSchema(t),
        url: z.string().min(20, { message: t('must be greater than', { count: 0 }) }),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getLogoCreateSchema = (t: TTranslateFn) =>
    getLogoUpdateSchema(t).omit({ id: true, url: true });

const getBaseOrganizationFormSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        code: z
            .string()
            .max(50, { message: t('must be less than characters', { count: 50 }) })
            .nullish(),
        name: z
            .string({
                required_error: t('please enter the name'),
                invalid_type_error: t('please enter the name')
            })
            .min(1, { message: t('please enter the name') }),
        accountId: z.string(),
        localIdentifierNameId: z.string(),
        localIdentifierValue: z.string().nullish(),
        accountRelation: z.string(),
        typeId: z.string().optional(),
        description: z.string().nullish(),
        isPrivate: z.boolean().optional(),
        isCharity: z.boolean().optional(),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getOrganizationCreateSchema = (t: TTranslateFn) =>
    getBaseOrganizationFormSchema(t)
        .omit({ id: true })
        .extend({
            logo: getLogoCreateSchema(t).nullish(),
            address: addressFormSchema.omit({ id: true }),
            phones: phonesFormSchema.element.omit({ id: true }).array(),
            emails: emailsFormSchema.element.omit({ id: true }).array(),
            attributes: attributesFormSchema
        });

export const getOrganizationUpdateSchema = (t: TTranslateFn) =>
    getBaseOrganizationFormSchema(t).extend({
        logo: getLogoUpdateSchema(t).nullish(),
        address: addressFormSchema,
        phones: phonesFormSchema,
        emails: emailsFormSchema,
        attributes: attributesFormSchema
    });

export const getOrganizationUpdateSchemaEmptyLogo = (t: TTranslateFn) =>
    getBaseOrganizationFormSchema(t).extend({
        logo: getLogoCreateSchema(t).nullish(),
        address: addressFormSchema,
        phones: phonesFormSchema,
        emails: emailsFormSchema,
        attributes: attributesFormSchema
    });

export const getCustomerOrgUpdateSchema = (t: TTranslateFn) =>
    getOrganizationUpdateSchema(t).extend({
        customerId: z
            .string({
                required_error: t('customer ID is missing')
            })
            .min(1, { message: t('customer ID is missing') })
    });

export const getCustomerOrgUpdateSchemaEmptyLogo = (t: TTranslateFn) =>
    getOrganizationUpdateSchemaEmptyLogo(t).extend({
        customerId: z
            .string({
                required_error: t('customer ID is missing')
            })
            .min(1, { message: t('customer ID is missing') })
    });
