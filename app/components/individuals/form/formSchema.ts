import {
    addressFormSchema,
    attributesFormSchema,
    emailsFormSchema,
    phonesFormSchema
} from '@/app/lib/data/common-form-schemas';
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

const fileSchema = z
    .instanceof(typeof File === 'undefined' ? Blob : File)
    .refine((file) => {
        if (!file) {
            return true;
        } else if (
            (typeof File !== 'undefined' && !(file instanceof File)) ||
            (typeof File === 'undefined' && !validateBEFile(file))
        ) {
            return false;
        }
        return file.size <= MAX_UPLOAD_SIZE;
    }, 'file size must be less than kb#many')
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
    }, 'file must be a PNG, JPG, JPEG, WEBP, or SVG image')
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

export const logoUpdateSchema = z.object({
    id: z.string(),
    name: z.string().min(5),
    size: z.coerce.number().gt(0),
    type: z.string().min(1),
    data: fileSchema,
    createdBy: z.string(),
    updatedBy: z.string()
});

export const logoCreateSchema = logoUpdateSchema.omit({ id: true });

const baseIndividualFormSchema = z.object({
    id: z.string(),
    firstName: z
        .string({
            required_error: 'please enter the first name',
            invalid_type_error: 'please enter the first name'
        })
        .min(1, { message: 'please enter the first name' }),
    lastName: z
        .string({
            required_error: 'please enter the last name',
            invalid_type_error: 'please enter the last name'
        })
        .min(1, { message: 'please enter the last name' }),
    middleName: z.string().nullish(),
    accountId: z.string(),
    localIdentifierNameId: z.string(),
    localIdentifierValue: z.string().nullish(),
    accountRelation: z.string(),
    customerId: z.string({
        required_error: 'please enter the customer ID'
    }),
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

export const individualCreateSchema = baseIndividualFormSchema.omit({ id: true }).extend({
    logo: logoCreateSchema,
    address: addressFormSchema.omit({ id: true }),
    phones: phonesFormSchema.element.omit({ id: true }).array(),
    emails: emailsFormSchema.element.omit({ id: true }).array(),
    attributes: attributesFormSchema
});

export const individualUpdateSchema = baseIndividualFormSchema.extend({
    logo: logoUpdateSchema,
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});

export const individualUpdateSchemaEmptyLogo = baseIndividualFormSchema.extend({
    logo: logoCreateSchema,
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});
