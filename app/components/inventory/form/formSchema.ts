import { z } from 'zod';

const baseInventoryFormSchema = z.object({
    id: z.string().optional(),
    accountId: z.string(),
    name: z
        .string({
            required_error: 'please enter the inventory name',
            invalid_type_error: 'please enter the inventory name'
        })
        .min(1, { message: 'must be at least 1 character long' }),
    description: z.string().nullish(),
    typeId: z
        .string({
            required_error: 'please enter the inventory type',
            invalid_type_error: 'please enter the inventory type'
        })
        .min(2, { message: 'please enter the inventory type' }),
    price: z.coerce
        .number({
            invalid_type_error: 'must be a number'
        })
        .gte(0.01, { message: 'the price cannot be less than 0.01' })
        .nullable()
        .transform((val, ctx) => {
            if (val === null) {
                ctx.addIssue({
                    code: 'invalid_type',
                    expected: 'number',
                    received: 'null'
                });
                return z.NEVER;
            }
            return Math.floor(val * 100);
        }),
    externalCode: z.string().nullish(),
    internalCode: z.string().nullish(),
    manufacturerCode: z.string().nullish(),
    manufacturerPrice: z.coerce
        .number()
        .gte(0.01, { message: 'the price cannot be less than 0.01' })
        .nullish()
        .transform((val, ctx) => {
            if (val === null) {
                ctx.addIssue({
                    code: 'invalid_type',
                    expected: 'number',
                    received: 'null'
                });
                return z.NEVER;
            }
            return val && Math.floor(val * 100);
        }),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const inventoryCreateSchema = baseInventoryFormSchema.omit({ id: true });
export const inventoryUpdateSchema = baseInventoryFormSchema;
