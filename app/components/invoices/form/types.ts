import { TEmail, TPhone } from '@/app/components/individuals/form/types';
import { TInventoryTransformed } from '@/app/lib/data/inventory/types';
import { TMeasurementUnit } from '@/app/lib/types';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { getInvoiceUpdateSchema } from './formSchema';

export interface IProps {
    customers: TCustomerOutput[];
    inventory: TInventoryTransformed[];
    measurementUnits: TMeasurementUnit[];
    accountId: string;
    locale: string;
    providerPhones: TPhone[];
    providerEmails: TEmail[];
    defaultValues: TInvoiceForm;
    isEdit: boolean;
}

export type TInvoiceForm = z.input<ReturnType<typeof getInvoiceUpdateSchema>>;
export type TInvoiceFormOutput = z.output<ReturnType<typeof getInvoiceUpdateSchema>>;
export type TInvoiceFormControl = Control<TInvoiceForm> & Control<FieldValues>;
export type TInvoiceItem = TInvoiceForm['invoiceItems'][number];
export type TInvoiceItemOutput = TInvoiceFormOutput['invoiceItems'][number];
export type TCustomerOutput = TInvoiceFormOutput['customer'];
