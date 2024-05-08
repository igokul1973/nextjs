import {
    addressFormSchema,
    attributesFormSchema,
    emailsFormSchema,
    phonesFormSchema
} from '@/app/lib/data/common-form-schemas';
import { isValidDate } from '@/app/lib/utils';
import dayjs from 'dayjs';
import { z } from 'zod';

const baseIndividualFormSchema = z.object({
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
    accountId: z.string(),
    localIdentifierNameId: z.string(),
    localIdentifierValue: z.string().nullish(),
    accountRelation: z.string(),
    customerId: z.string({
        required_error: 'please enter the customer ID'
    }),
    dob: isValidDate('invalid date')
        .nullish()
        .transform((val) => {
            if (dayjs.isDayjs(val)) {
                return val.toDate();
            }
            return val;
        }),
    description: z.string().nullish(),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const individualCreateSchema = baseIndividualFormSchema.omit({ id: true }).extend({
    address: addressFormSchema.omit({ id: true }),
    phones: phonesFormSchema.element.omit({ id: true }).array(),
    emails: emailsFormSchema.element.omit({ id: true }).array(),
    attributes: attributesFormSchema
});

export const individualUpdateSchema = baseIndividualFormSchema.extend({
    address: addressFormSchema,
    phones: phonesFormSchema,
    emails: emailsFormSchema,
    attributes: attributesFormSchema
});
