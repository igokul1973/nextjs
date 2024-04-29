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

    date: z.coerce.date(),
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
    payBy: z.coerce
        .date({
            required_error: 'enter the date the invoice must be paid by',
            invalid_type_error: 'must be a date'
        })
        .min(new Date()),
    paidOn: z.coerce.date().nullish().optional(),
    paymentInfo: z.string().optional(),
    terms: z.string().optional(),
    // Tax percentage (can be state sales tax in USA or VAT in Europe), default is 0
    tax: z.coerce.number(),
    // Discount percentage on whole invoice, default is 0.
    discount: z.coerce.number(),
    notes: z.string().optional(),
    createdBy: z.string(),
    updatedBy: z.string()
});

const baseInvoiceItemFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.coerce
        .number({
            invalid_type_error: 'must be a number'
        })
        .gte(0.01, { message: 'the price cannot be less than 0.01' })
        .transform((val) => {
            return Math.floor(val * 100);
        }),
    quantity: z.coerce.number(),
    inventoryId: z.string(),
    createdBy: z.string(),
    updatedBy: z.string()
});

export const invoiceCreateSchema = baseInvoiceFormSchema.omit({ id: true }).extend({
    invoiceItems: baseInvoiceItemFormSchema.omit({ id: true })
});

export const invoiceUpdateSchema = baseInvoiceFormSchema.extend({
    invoiceItems: baseInvoiceItemFormSchema
});
