import { TTransformedInvoice } from '@/app/lib/data/invoice/types';

type IViewInvoice = Omit<TTransformedInvoice, 'date' | 'payBy' | 'paidOn'> & {
    date: string;
    payBy: string;
    paidOn: string | null;
};

export interface IProps {
    invoice: IViewInvoice;
    locale: string;
    isDisplayCustomerLocalIdentifier: boolean;
    isDisplayProviderLocalIdentifier: boolean;
}

export interface IInvoiceItemsTableProps {
    invoiceItems: TTransformedInvoice['invoiceItems'];
    locale: string;
}

export interface ICustomerTableProps {
    customer: TTransformedInvoice['customer'];
}
