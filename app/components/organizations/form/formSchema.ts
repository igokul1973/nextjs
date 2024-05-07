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
    localIdentifierNameId: z.string().optional(),
    localIdentifierValue: z.string().nullish().optional(),
    accountRelation: z.string(),
    customerId: z.string({
        required_error: 'please enter the customer ID'
    }),
    typeId: z.string().optional(),
    description: z.string().nullish().optional(),
    isPrivate: z.boolean().optional(),
    isCharity: z.boolean().optional(),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const organizationUpdateSchema = baseOrganizationFormSchema.extend({
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});

export const organizationCreateSchema = baseOrganizationFormSchema.omit({ id: true }).extend({
    address: addressFormSchema.omit({ id: true }),
    phones: phonesFormSchema.element.omit({ id: true }).array(),
    emails: emailsFormSchema.element.omit({ id: true }).array(),
    attributes: attributesFormSchema
});
