import { z } from 'zod';

const FormSchema = z.object({
    id: z.string().optional(),
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
    middleName: z.string().optional(),
    dob: z.coerce.date().nullish().optional(),
    description: z.string().optional(),
    address: z.object({
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
    }),
    phones: z
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
        .min(1, { message: 'please enter the phone number' }),
    emails: z
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
        .min(1, { message: 'please enter the email address' }),
    attributes: z.array(
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
    )
});

export default FormSchema;
