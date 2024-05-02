import { TInventory, TInventoryType } from '@/app/lib/types';
import { TFlattenedCustomer } from '@/app/lib/utils';
import { Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { invoiceUpdateSchema } from './formSchema';

export interface IProps {
    customers: TFlattenedCustomer[];
    inventory: (TInventory & { type: TInventoryType })[];
    form?: TInvoiceForm;
}

export type TInvoiceForm = z.input<typeof invoiceUpdateSchema>;
export type TInvoiceFormOutput = z.output<typeof invoiceUpdateSchema>;
export type TInvoiceFormControl = Control<TInvoiceForm> & Control<FieldValues>;
export type TInvoiceItem = TInvoiceFormOutput['invoiceItems'][number];
