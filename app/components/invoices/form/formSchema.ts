import { isValidDate } from '@/app/lib/utils';
import { z } from 'zod';

const baseInvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z
        .string({
            required_error: 'please enter the customer'
        })
        .min(1, { message: 'must be at least characters#many' }),
    number: z
        .string({
            required_error: 'please enter the invoice number',
            invalid_type_error: 'please enter the invoice number'
        })
        .min(1, { message: 'must be at least characters#many' }),

    date: isValidDate('invalid date'),
    status: z.string(),
    customerName: z.string(),
    customerAddressLine1: z.string(),
    customerAddressLine2: z.string(),
    customerAddressLine3: z.string(),
    customerLocality: z.string(),
    customerRegion: z.string(),
    customerPostalCode: z.string(),
    customerCountry: z.string(),
    customerPhone: z.string(),
    customerEmail: z.string(),
    providerPhone: z.string(),
    providerEmail: z.string(),
    purchaseOrderNumbers: z.array(z.string()).optional(),
    manufacturerInvoiceNumbers: z.array(z.string()).optional(),
    additionalInformation: z.string().optional(),
    payBy: isValidDate('invalid date')
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
    paymentInfo: z.string().optional(),
    paidOn: isValidDate('invalid date').nullish(),
    terms: z.string().optional(),
    // Tax percentage (can be state sales tax in USA or VAT in Europe), default is 0
    tax: z
        .number()
        .min(0, { message: 'the tax cannot be less than 0' })
        .max(100, { message: 'the tax cannot be more than 100' }),
    // Discount percentage on whole invoice, default is 0.
    discount: z
        .number()
        .min(0, { message: 'the discount cannot be less than 0' })
        .max(100, { message: 'the discount cannot be more than 100' }),
    notes: z.string().optional(),
    createdBy: z.string(),
    updatedBy: z.string()
});
const baseInvoiceItemFormSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string().min(1, { message: 'please select inventory item to get the id' }),
        inventoryItem: z
            .object(
                { id: z.string(), name: z.string() },
                {
                    required_error: 'please enter the inventory item name',
                    invalid_type_error: 'please enter the inventory item name'
                }
            )
            .nullable()
            .transform((val, ctx) => {
                if (val === null) {
                    ctx.addIssue({
                        code: 'invalid_type',
                        expected: 'object',
                        received: 'null'
                    });
                    return z.NEVER;
                }
                return val;
            }),
        price: z
            .number({
                invalid_type_error: 'please select inventory item to get the price'
            })
            .gte(0.01, { message: 'please select inventory item to get the price' })
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
        quantity: z.coerce.number(),
        inventoryId: z
            .string({
                required_error: 'please select inventory item to get the id',
                invalid_type_error: 'please select inventory item to get the id'
            })
            .min(1, { message: 'please select inventory item to get the id' }),
        createdBy: z.string(),
        updatedBy: z.string()
    })
);

export const invoiceCreateSchema = baseInvoiceFormSchema.omit({ id: true }).extend({
    invoiceItems: baseInvoiceItemFormSchema.element.omit({ id: true }).array()
});

export const invoiceUpdateSchema = baseInvoiceFormSchema.extend({
    invoiceItems: baseInvoiceItemFormSchema
});
