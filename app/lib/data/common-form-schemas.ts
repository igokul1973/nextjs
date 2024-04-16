import { z } from 'zod';

export const addressFormSchema = z.object({
    addressLine1: z
        .string({
            required_error: 'please enter the street address',
            invalid_type_error: 'please enter the street address'
        })
        .min(2, { message: 'please enter the street address' }),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    locality: z
        .string({
            required_error: 'please enter the city/village/locality',
            invalid_type_error: 'please enter the city/village/locality'
        })
        .min(2, { message: 'please enter the city/village/locality' }),
    region: z
        .string({
            invalid_type_error: 'please enter the region/state'
        })
        .optional(),
    postcode: z
        .string({
            required_error: 'please enter the zip/postal code',
            invalid_type_error: 'please enter the zip/postal code'
        })
        .min(4, { message: 'please enter the zip/postal code' }),

    countryId: z
        .string({
            required_error: 'please enter the country',
            invalid_type_error: 'please enter the country'
        })
        .min(10, { message: 'please enter the country' })
});

export const phonesFormSchema = z
    .array(
        z.object({
            countryCode: z.coerce
                .number({
                    required_error: 'please enter the country code',
                    invalid_type_error: 'please enter the country code'
                })
                .positive({ message: 'please enter the country code' })
                .min(1, { message: 'please enter the country code' })
                .max(999, { message: 'the country code cannot be bigger than 999' }),
            number: z.coerce
                .number({
                    required_error: 'please enter the phone number',
                    invalid_type_error: 'please enter the phone number'
                })
                .positive({ message: 'please enter the phone number' })
                .min(10000000, { message: 'please enter the phone number' })
                .max(99999999999999, {
                    message: 'the phone number cannot have more than 13 numbers'
                }),
            type: z
                .string({
                    required_error: 'please enter the phone type',
                    invalid_type_error: 'please enter the phone type'
                })
                .min(2, { message: 'please enter the phone type' })
        })
    )
    .min(1, { message: 'please enter the phone number' });

export const emailsFormSchema = z
    .array(
        z.object({
            email: z
                .string({
                    required_error: 'please enter the email address',
                    invalid_type_error: 'please enter the email address'
                })
                .email({ message: 'please enter a valid email address' }),
            type: z
                .string({
                    required_error: 'please enter the email type',
                    invalid_type_error: 'please enter the email type'
                })
                .min(2, { message: 'please enter the email type' })
        })
    )
    .min(1, { message: 'please enter the email address' });

export const attributesFormSchema = z.array(
    z.object({
        type: z
            .string({
                required_error: 'please enter the attribute type',
                invalid_type_error: 'please enter the attribute type'
            })
            .min(4, { message: 'please enter the attribute type' }),
        name: z
            .string({
                required_error: 'please enter the attribute name',
                invalid_type_error: 'please enter the attribute name'
            })
            .min(1, { message: 'please enter the attribute name' }),
        value: z
            .string({
                required_error: 'please enter the attribute value',
                invalid_type_error: 'please enter the attribute value'
            })
            .min(1, { message: 'please enter the attribute value' })
    })
);
