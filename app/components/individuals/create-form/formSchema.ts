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
    localIdentifierNameId: z.string().nullish(),
    localIdentifierValue: z.string().optional().nullish(),
    accountRelation: z.string().optional(),
    dob: z.coerce.date().nullish().optional(),
    description: z.string().nullish().optional(),
    createdBy: z.string(),
    updatedBy: z.string()
});

const individualFormSchema = baseIndividualFormSchema.extend({
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});

export default individualFormSchema;
