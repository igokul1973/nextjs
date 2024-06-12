import { TTranslateFn } from '@/app/lib/types';
import { isValidDate } from '@/app/lib/utils';
import dayjs from 'dayjs';
import { z } from 'zod';

const getBaseInvoiceFormSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        customer: z
            .object(
                {
                    customerId: z
                        .string({
                            required_error: t('please enter a customer')
                        })
                        .min(1, { message: t('must be at least characters', { count: 1 }) }),
                    customerCode: z.string().nullish(),
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
                    customerEmail: z.string().min(1),
                    customerLocalIdentifierNameAbbrev: z.string().optional(),
                    customerLocalIdentifierValue: z.string().optional()
                },
                {
                    errorMap: (issue, ctx) => {
                        return issue.code === 'invalid_type'
                            ? {
                                  message: t('please enter a customer')
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
                required_error: t('please enter the invoice number'),
                invalid_type_error: t('please enter the invoice number')
            })
            .min(1, { message: t('must be at least characters', { count: 1 }) }),

        date: isValidDate(t('invalid date'))
            .nullable()
            .refine(
                (val) => {
                    return val !== null;
                },
                { message: t('invalid date') }
            )
            .transform((val) => {
                // Removes null from return type
                if (val === null) {
                    return z.NEVER;
                }
                // Transforms dayjs to Date because
                // Next.js complains about the Dayjs object
                // containing methods (being not a POJO)
                if (dayjs.isDayjs(val)) {
                    return val.toDate();
                }
                return val;
            }),
        status: z.string().min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerName: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerAddressLine1: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerAddressLine2: z.string().nullish(),
        providerAddressLine3: z.string().nullish(),
        providerLocality: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerRegion: z.string().nullish(),
        providerPostCode: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerCountry: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerPhone: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        providerEmail: z
            .string()
            .min(1, { message: t('must be at least characters', { count: 1 }) }),
        purchaseOrderNumbers: z.array(z.string()).optional(),
        manufacturerInvoiceNumbers: z.array(z.string()).optional(),
        additionalInformation: z.string().optional(),
        customerRef: z.string().optional(),
        providerRef: z.string().optional(),
        customerLocalIdentifierNameAbbrev: z.string().optional(),
        providerLocalIdentifierNameAbbrev: z.string().optional(),
        customerLocalIdentifierValue: z.string().optional(),
        providerLocalIdentifierValue: z.string().optional(),
        // This is an example of the Date picker
        // field which can have default value null and is MANDATORY.
        payBy: isValidDate(t('invalid date'))
            .nullable()
            .refine(
                (val) => {
                    return val !== null;
                },
                { message: t('invalid date') }
            )
            .transform((val) => {
                // Removes null from return type
                if (val === null) {
                    return z.NEVER;
                }
                // Transforms dayjs to Date because
                // Next.js complains about the Dayjs object
                // containing methods (being not a POJO)
                if (dayjs.isDayjs(val)) {
                    return val.toDate();
                }
                return val;
            }),
        paymentInfo: z.string().optional(),
        // This is an example of the Date picker
        // field which can have default value null and is NOT MANDATORY.
        // If the user enters invalid date, however,
        // the 'invalid date' error will be shown.
        paidOn: isValidDate(t('invalid date'))
            .nullish()
            .transform((val) => {
                // Transforms dayjs to Date because
                // Next.js complains about the Dayjs object
                // containing methods (being not a POJO)
                if (dayjs.isDayjs(val)) {
                    return val.toDate();
                }
                return val;
            }),
        paymentTerms: z.string().nullish(),
        deliveryTerms: z.string().nullish(),
        terms: z.string().nullish(),
        notes: z.string().optional(),
        createdBy: z.string(),
        updatedBy: z.string()
    });
const getBaseInvoiceItemFormSchema = (t: TTranslateFn) =>
    z
        .array(
            z.object({
                id: z.string(),
                name: z.string().min(1, { message: t('please select the inventory item name') }),
                inventoryItem: z
                    .object(
                        {
                            id: z.string(),
                            name: z.string({
                                required_error: t('please select the inventory item name')
                            }),
                            description: z.string().nullish(),
                            internalCode: z.string().nullish(),
                            externalCode: z.string().nullish(),
                            manufacturerCode: z.string().nullish()
                        },
                        {
                            required_error: t('please enter the inventory item name'),
                            invalid_type_error: t('please enter the inventory item name')
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
                        invalid_type_error: t('must be a number')
                    })
                    .gt(0, {
                        message: t('select inventory item to get the price or enter one manually')
                    })
                    .lte(99999999999999, {
                        message: t('price cannot be more than 999 999 999 999.99')
                    })
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
                // Discount percentage on invoice item, default is 0.
                // Will be multiplied by 100 on output for database storage
                // and calculations.
                discount: z
                    .number({
                        invalid_type_error: t('must be a number')
                    })
                    .min(0, { message: t('must be more than or equal to', { count: 0 }) })
                    .max(10000, { message: t('must be less than or equal to', { count: 100 }) })
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
                // Tax percentage (can be state sales tax in USA or VAT in Europe), default is 0.
                // Will be multiplied by 1000 on output for database storage
                // and calculations.
                salesTax: z
                    .number({
                        invalid_type_error: t('must be a number')
                    })
                    .min(0, { message: t('must be more than or equal to', { count: 0 }) })
                    .max(100000, { message: t('must be less than or equal to', { count: 100 }) })
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
                quantity: z.coerce
                    .number({
                        invalid_type_error: t('must be a number')
                    })
                    .gt(0, { message: t('must be more than', { count: 0 }) })
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
                measurementUnit: z
                    .object(
                        {
                            id: z.string(),
                            name: z
                                .string({
                                    required_error: t('enter the unit')
                                })
                                .min(1),
                            abbreviation: z.string().nullish()
                        },
                        {
                            required_error: t('enter the unit'),
                            invalid_type_error: t('enter the unit')
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
                inventoryId: z
                    .string({
                        required_error: t('please select inventory item'),
                        invalid_type_error: t('please select inventory item')
                    })
                    .min(1, { message: t('please select inventory item') }),
                createdBy: z.string(),
                updatedBy: z.string()
            })
        )
        .min(1, t('please enter at least one invoice item'));

export const getInvoiceCreateSchema = (t: TTranslateFn) => {
    return getBaseInvoiceFormSchema(t)
        .omit({ id: true })
        .extend({
            invoiceItems: getBaseInvoiceItemFormSchema(t).element.omit({ id: true }).array()
        });
};

export const getInvoiceUpdateSchema = (t: TTranslateFn) => {
    return getBaseInvoiceFormSchema(t).extend({
        invoiceItems: getBaseInvoiceItemFormSchema(t),
        providerLogoId: z.string().nullable()
    });
};
