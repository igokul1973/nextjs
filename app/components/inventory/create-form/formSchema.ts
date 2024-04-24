import { z } from 'zod';

const baseInventoryFormSchema = z.object({
    id: z.string().optional(),
    name: z
        .string({
            required_error: 'please enter the inventory name',
            invalid_type_error: 'please enter the inventory name'
        })
        .min(1, { message: 'must be at least 1 character long' }),
    description: z.string().optional(),
    typeId: z.string({
        required_error: 'please enter the inventory type',
        invalid_type_error: 'please enter the inventory type'
    }),
    price: z.coerce.number({
        invalid_type_error: 'must be a number'
    }),
    externalCode: z.string().optional(),
    internalCode: z.string().optional(),
    manufacturerCode: z.string().optional(),
    manufacturerPrice: z.coerce.number().optional()
});

export const inventoryCreateSchema = baseInventoryFormSchema.omit({ id: true });
export const inventoryUpdateSchema = baseInventoryFormSchema;
