import {
    addressFormSchema,
    attributesFormSchema,
    emailsFormSchema,
    phonesFormSchema
} from '@/app/lib/data/common-form-schemas';
import { z } from 'zod';

const baseIndividualFormSchema = z.object({
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
    middleName: z.string().optional().nullish(),
    accountId: z.string(),
    localIdentifierNameId: z.string().optional(),
    localIdentifierValue: z.string().optional().nullish(),
    accountRelation: z.string(),
    customerId: z.string().optional(),
    dob: z.coerce.date().nullish().optional(),
    description: z.string().nullish().optional(),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const individualUpdateSchema = baseIndividualFormSchema.extend({
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});

export const individualCreateSchema = baseIndividualFormSchema.omit({ id: true }).extend({
    address: addressFormSchema.omit({ id: true }),
    phones: phonesFormSchema.element.omit({ id: true }).array(),
    emails: emailsFormSchema.element.omit({ id: true }).array(),
    attributes: attributesFormSchema
});
