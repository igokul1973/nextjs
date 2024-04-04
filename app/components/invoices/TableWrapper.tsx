import { getFilteredInvoicesByAccountId } from '@/app/lib/data/invoices';
import InvoicesTable from './InvoicesTable';
import { InvoiceStatusEnum } from '@prisma/client';

interface IProps {
    accountId: string;
    query: string;
}

export interface IInvoice {
    id: string;
    number: string;
    date: string;
    status: InvoiceStatusEnum;
    customerName: string;
    customerEmail: string;
    createdByUserEmail: string;
}

const TableWrapper = async ({ accountId, query }: IProps) => {
    const invoices = (await getFilteredInvoicesByAccountId(accountId, query)).map((invoice) => {
        return {
            id: invoice.id,
            number: invoice.number,
            date: invoice.date,
            status: invoice.status,
            customerName: invoice.customer?.name,
            customerEmail: invoice.customer?.email,
            createdByUserEmail: invoice.createdByUser.email
        };
    });
    return <InvoicesTable invoices={invoices} />;
};

export default TableWrapper;
