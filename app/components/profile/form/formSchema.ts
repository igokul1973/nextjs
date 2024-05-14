import { z } from 'zod';

export const MAX_UPLOAD_SIZE = 1024 * 300; // 300KB
export const ACCEPTED_FILE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
];

const baseProfileFormSchema = z.object({
    id: z.string(),
    avatar: z
        .instanceof(File)
        .optional()
        .refine((file) => {
            return !file || file.size <= MAX_UPLOAD_SIZE;
        }, 'file size must be less than kb#many')
        .refine((file) => {
            return !!file && ACCEPTED_FILE_TYPES.includes(file.type);
        }, 'file must be a PNG, JPG, JPEG, WEBP, or SVG image'),
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

export const profileCreateSchema = baseProfileFormSchema.omit({ id: true });

export const profileUpdateSchema = baseProfileFormSchema;
