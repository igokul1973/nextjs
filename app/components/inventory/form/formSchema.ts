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
    description: z.string().optional(),
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
        .transform((val) => {
            return Math.floor(val * 100);
        }),
    externalCode: z.string().optional(),
    internalCode: z.string().optional(),
    manufacturerCode: z.string().optional(),
    manufacturerPrice: z.coerce
        .number()
        .gte(0.01, { message: 'the price cannot be less than 0.01' })
        .or(z.literal(''))
        .optional()
        .transform((val) => {
            if (val) {
                return Math.floor(val * 100);
            }
        }),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const inventoryCreateSchema = baseInventoryFormSchema.omit({ id: true });
export const inventoryUpdateSchema = baseInventoryFormSchema;
