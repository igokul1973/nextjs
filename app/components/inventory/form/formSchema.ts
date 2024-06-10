import { TTranslateFn } from '@/app/lib/types';
import { z } from 'zod';

const getBaseInventoryFormSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        accountId: z.string(),
        name: z
            .string({
                required_error: t('please enter the inventory item name'),
                invalid_type_error: t('please enter the inventory item name')
            })
            .min(1, { message: t('must be at least characters', { count: 1 }) })
            .max(80, { message: t('must be less than characters', { count: 80 }) }),
        description: z.string().nullish(),
        typeId: z
            .string({
                required_error: t('please enter the inventory item type'),
                invalid_type_error: t('please enter the inventory item type')
            })
            .min(2, { message: t('please enter the inventory item type') }),
        price: z.coerce
            .number({
                invalid_type_error: t('must be a number')
            })
            .gte(0.01, { message: t('must be more than', { count: 0.01 }) })
            .lte(99999999999999, { message: t('price cannot be more than 999 999 999 999.99') })
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
                return val;
            }),
        externalCode: z.string().nullish(),
        internalCode: z.string().nullish(),
        manufacturerCode: z.string().nullish(),
        manufacturerPrice: z.coerce
            .number({
                invalid_type_error: t('must be a number')
            })
            .lte(99999999999999, { message: t('price cannot be more than 999 999 999 999.99') })
            .nullish(),
        createdBy: z.string(),
        updatedBy: z.string()
    });

// export const inventoryCreateSchema = baseInventoryFormSchema.omit({ id: true });
export const getInventoryCreateSchema = (t: TTranslateFn) => {
    return getBaseInventoryFormSchema(t).omit({ id: true });
};

// export const inventoryUpdateSchema = baseInventoryFormSchema;
export const getInventoryUpdateSchema = (t: TTranslateFn) => {
    return getBaseInventoryFormSchema(t);
};
