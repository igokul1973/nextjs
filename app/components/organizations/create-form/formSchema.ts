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
    localIdentifierNameId: z.string().optional(),
    localIdentifierValue: z.string().optional(),
    typeId: z.string().optional(),
    description: z.string().optional(),
    isPrivate: z.boolean().optional(),
    isCharity: z.boolean().optional()
});

const organizationFormSchema = baseOrganizationFormSchema.extend({
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});

export default organizationFormSchema;
