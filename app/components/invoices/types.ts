import { TFlattenedCustomer } from '@/app/lib/utils';
import { InvoiceStatusEnum } from '@prisma/client';

export interface IInvoiceTable {
    id: string;
    number: string;
    customerName: TFlattenedCustomer['name'];
    amount: string;
    status: InvoiceStatusEnum;
    date: string;
    actions: string;
}
