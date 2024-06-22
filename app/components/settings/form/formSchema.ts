import { TTranslateFn } from '@/app/lib/types';
import { z } from 'zod';
import { dateFormats, emailTypes, phoneTypes } from './constants';

//   dateFormat                         String        @default("YYYY/MM/DD") @map("date_format") @db.VarChar(12)
//   providerInvoicePhoneType           PhoneTypeEnum @default(invoicing) @map("provider_invoice_phone_type")
//   providerInvoiceEmailType           EmailTypeEnum @default(invoicing) @map("provider_invoice_email_type")

//   paymentInformation                 String        @default("") @map("payment_information") @db.VarChar(255)
//   paymentTerms                       String        @default("") @map("payment_terms") @db.VarChar(255)
//   deliveryTerms                      String        @default("") @map("delivery_terms") @db.VarChar(255)
//   terms                              String        @default("") @db.VarChar(255)
//   salesTax                           Int           @default(0) @map("sales_tax") @db.Integer

//   isDisplayCustomerLocalIdentifier   Boolean       @default(false) @map("is_display_customer_local_identifier")
//   isObfuscateCustomerLocalIdentifier Boolean       @default(true) @map("is_obfuscate_customer_local_identifier")
//   isDisplayProviderLocalIdentifier   Boolean       @default(false) @map("is_display_provider_local_identifier")
//   isObfuscateProviderLocalIdentifier Boolean       @default(true) @map("is_obfuscate_provider_local_identifier")

export const getSettingsUpdateSchema = (t: TTranslateFn) =>
    z.object({
        id: z.string(),
        dateFormat: z.enum(dateFormats, {
            invalid_type_error: t('please enter the date format')
        }),
        providerInvoicePhoneType: z.enum(phoneTypes, {
            invalid_type_error: t('please enter the phone type')
        }),
        providerInvoiceEmailType: z.enum(emailTypes, {
            invalid_type_error: t('please enter the email type')
        }),
        paymentInformation: z.string().optional(),
        paymentTerms: z.string().optional(),
        deliveryTerms: z.string().optional(),
        terms: z.string().optional(),
        salesTax: z
            .number({
                invalid_type_error: t('must be a number')
            })
            .min(0, { message: t('must be greater than or equal to', { count: 0 }) })
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
        isDisplayCustomerLocalIdentifier: z.boolean(),
        isObfuscateCustomerLocalIdentifier: z.boolean(),
        isDisplayProviderLocalIdentifier: z.boolean(),
        isObfuscateProviderLocalIdentifier: z.boolean(),
        accountId: z.string({
            required_error: t('please enter the account ID'),
            invalid_type_error: t('please enter the account ID')
        }),
        createdBy: z.string(),
        updatedBy: z.string()
    });

export const getSettingsCreateSchema = (t: TTranslateFn) =>
    getSettingsUpdateSchema(t).omit({ id: true });
