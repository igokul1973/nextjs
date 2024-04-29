import { TFlattenedCustomer } from '@/app/lib/utils';
import { Control, FieldValues } from 'react-hook-form';
import { invoiceUpdateSchema } from './formSchema';

export interface IProps {
    customers: TFlattenedCustomer[];
    form?: TInvoiceForm;
}

export type TInvoiceForm = z.infer<typeof invoiceUpdateSchema>;
export type TInvoiceFormControl = Control<TInvoiceForm> & Control<FieldValues>;
export type TInvoiceItem = TInvoiceForm['invoiceItems'][number];
