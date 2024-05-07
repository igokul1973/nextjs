import { isDayJsDate, isValidDate } from '@/app/lib/utils';
import { z } from 'zod';

const baseInvoiceFormSchema = z.object({
    id: z.string(),
    customer: z
        .object(
            {
                customerId: z
                    .string({
                        required_error: 'please enter a customer'
                    })
                    .min(1, { message: 'must be at least characters#many' }),
                customerType: z.string().optional(),
                customerName: z.string().min(1),
                customerAddressLine1: z.string().min(1),
                customerAddressLine2: z.string().nullish(),
                customerAddressLine3: z.string().nullish(),
                customerLocality: z.string().min(1),
                customerRegion: z.string().nullish(),
                customerPostCode: z.string().min(1),
                customerCountry: z.string().min(1),
                customerPhone: z.string().min(1),
                customerEmail: z.string().min(1)
            },
            {
                errorMap: (issue, ctx) => {
                    return issue.code === 'invalid_type'
                        ? {
                              message: 'please enter a customer'
                          }
                        : {
                              message: ctx.defaultError
                          };
                }
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
    number: z
        .string({
            required_error: 'please enter the invoice number',
            invalid_type_error: 'please enter the invoice number'
        })
        .min(1, { message: 'must be at least characters#many' }),

    date: isValidDate('invalid date').transform((val) => {
        if (val instanceof Date || isDayJsDate(val)) {
            return new Date(val);
        }
        return val;
    }),
    status: z.string().min(1),
    providerPhone: z.string().min(1),
    providerEmail: z.string().min(1),
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
            return new Date(val);
        }),
    paymentInfo: z.string().optional(),
    paidOn: isValidDate('invalid date')
        .nullish()
        .transform((val) => {
            if (val && (val instanceof Date || isDayJsDate(val))) {
                return new Date(val);
            }
            return val;
        }),
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
                {
                    id: z.string(),
                    name: z.string({
                        required_error: 'please select inventory item to get the name'
                    }),
                    description: z.string().nullish(),
                    internalCode: z.string().nullish(),
                    externalCode: z.string().nullish(),
                    manufacturerCode: z.string().nullish()
                },
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
        quantity: z.coerce
            .number({
                invalid_type_error: 'must be more than#many'
            })
            .gt(0, { message: 'must be more than#many' })
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
