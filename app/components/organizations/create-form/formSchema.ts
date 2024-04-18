import {
    addressFormSchema,
    attributesFormSchema,
    emailsFormSchema,
    phonesFormSchema
} from '@/app/lib/data/common-form-schemas';
import { z } from 'zod';

const baseOrganizationFormSchema = z.object({
    id: z.string().optional(),
    name: z
        .string({
            required_error: 'please enter the name',
            invalid_type_error: 'please enter the name'
        })
        .min(1, { message: 'please enter the name' }),
    accountId: z.string(),
    localIdentifierNameId: z.string().nullish().optional(),
    localIdentifierValue: z.string().nullish().optional(),
    accountRelation: z.string().optional(),
    typeId: z.string().nullish().optional(),
    description: z.string().nullish().optional(),
    isPrivate: z.boolean().nullish().optional(),
    isCharity: z.boolean().nullish().optional(),
    createdBy: z.string(),
    updatedBy: z.string()
});

const organizationFormSchema = baseOrganizationFormSchema.extend({
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});

export default organizationFormSchema;
