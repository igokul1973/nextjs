import { InvoiceStatusEnum } from '@prisma/client';
import { TCustomerOutput } from './form/types';

export interface IInvoiceTable {
    id: string;
    number: string;
    customerName: TCustomerOutput['customerName'];
    amount: string;
    status: InvoiceStatusEnum;
    date: string;
    actions?: string;
}
