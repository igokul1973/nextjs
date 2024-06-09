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
    }, 'file size must be less than kb#other')
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

export const avatarUpdateSchema = z.object({
    id: z.string(),
    name: z.string().min(5),
    size: z.coerce.number().gt(0),
    type: z.string().min(1),
    data: fileSchema,
    createdBy: z.string(),
    updatedBy: z.string()
});

export const avatarCreateSchema = avatarUpdateSchema.omit({ id: true });

const profileUpdateSchemaRaw = z.object({
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
    userId: z.string({
        required_error: 'please enter the user ID',
        invalid_type_error: 'please enter the user ID'
    }),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const profileUpdateSchema = profileUpdateSchemaRaw.extend({
    avatar: avatarUpdateSchema.nullable()
});

export const profileUpdateSchemaEmptyAvatar = profileUpdateSchemaRaw.extend({
    avatar: avatarCreateSchema.nullable()
});

export const profileCreateSchema = profileUpdateSchema.omit({ id: true }).extend({
    avatar: avatarCreateSchema.nullable()
});
