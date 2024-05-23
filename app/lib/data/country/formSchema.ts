import { z } from 'zod';

export const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: `Please enter country's name`
    }),
    abbreviation: z
        .string({
            invalid_type_error: `Please enter country's name`
        })
        .nullable(),
    locale: z.string().min(3, { message: 'please enter the locale code' }),
    phoneCode: z.preprocess(
        (value) => {
            return typeof value === 'string' && value.startsWith('+') ? value.slice(1) : value;
        },
        z
            .string({
                required_error: 'please enter the country code',
                invalid_type_error: 'please enter the country code'
            })
            .min(1, { message: 'please enter the country code' })
            .max(3, { message: 'the country code cannot be bigger than 999' })
    )
});
