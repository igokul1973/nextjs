import { TTransformedInvoice } from '@/app/lib/data/invoice/types';

export interface IProps {
    invoice: TTransformedInvoice;
}

export interface IInvoiceItemsTableProps {
    invoiceItems: TTransformedInvoice['invoiceItems'];
}
