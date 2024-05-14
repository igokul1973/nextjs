import { TTransformedInvoice } from '@/app/lib/data/invoice/types';

type IViewInvoice = Omit<TTransformedInvoice, 'date' | 'payBy' | 'paidOn'> & {
    date: string;
    payBy: string;
    paidOn: string | null;
};

export interface IProps {
    invoice: IViewInvoice;
    locale: string;
}

export interface IInvoiceItemsTableProps {
    tax: IViewInvoice['tax'];
    invoiceItems: TTransformedInvoice['invoiceItems'];
    locale: string;
}

export interface ICustomerTableProps {
    customer: TTransformedInvoice['customer'];
}
