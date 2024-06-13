import {
    addressFormSchema,
    attributesFormSchema,
    emailsFormSchema,
    phonesFormSchema
} from '@/app/lib/data/common-form-schemas';
import { TTranslateFn } from '@/app/lib/types';
import { isValidDate } from '@/app/lib/utils';
import dayjs from 'dayjs';
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
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getLogoCreateSchema = (t: TTranslateFn) => getLogoUpdateSchema(t).omit({ id: true });

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

export const getIndividualCreateSchema = (t: TTranslateFn) =>
    getBaseIndividualFormSchema(t)
        .omit({ id: true })
        .extend({
            logo: getLogoCreateSchema(t).nullish(),
            address: addressFormSchema.omit({ id: true }),
            phones: phonesFormSchema.element.omit({ id: true }).array(),
            emails: emailsFormSchema.element.omit({ id: true }).array(),
            attributes: attributesFormSchema
        });

export const getIndividualUpdateSchema = (t: TTranslateFn) =>
    getBaseIndividualFormSchema(t).extend({
        logo: getLogoUpdateSchema(t).nullish(),
        customerId: z.string({
            required_error: t('customer ID is missing')
        }),
        address: addressFormSchema,
        phones: phonesFormSchema,
        emails: emailsFormSchema,
        attributes: attributesFormSchema
    });

export const getIndividualUpdateSchemaEmptyLogo = (t: TTranslateFn) =>
    getBaseIndividualFormSchema(t).extend({
        logo: getLogoCreateSchema(t).nullish(),
        customerId: z.string({
            required_error: t('customer ID is missing')
        }),
        address: addressFormSchema,
        phones: phonesFormSchema,
        emails: emailsFormSchema,
        attributes: attributesFormSchema
    });
