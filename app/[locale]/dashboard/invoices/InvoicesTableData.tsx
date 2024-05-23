import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import Warning from '@/app/components/warning/Warning';
import {
    getFilteredInvoicesByAccountId,
    getFilteredInvoicesByAccountIdCount
} from '@/app/lib/data/invoice';
import { formatCurrency, getUser } from '@/app/lib/utils';
import { FC } from 'react';
import { TInvoicesDataProps } from './types';

const InvoicesTableData: FC<TInvoicesDataProps> = async ({ searchParams, tableName }) => {
    const { query } = searchParams;
    const { provider, account } = await getUser();

    const countPromise = await getFilteredInvoicesByAccountIdCount(account.id, query);
    const rawInvoicesPromise = await getFilteredInvoicesByAccountId({
        accountId: account.id,
        ...searchParams
    });

    const [count, rawInvoices] = await Promise.all([countPromise, rawInvoicesPromise]);

    const userAccountCountry = provider?.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before listing invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const invoices = rawInvoices.map((invoice) => {
        return {
            ...invoice,
            amount: formatCurrency(invoice.amount, userAccountCountry.locale),
            date: invoice.date.toLocaleDateString(userAccountCountry.locale),
            payBy: invoice.payBy.toLocaleDateString(userAccountCountry.locale),
            paidOn: invoice.paidOn?.toLocaleDateString(userAccountCountry.locale)
        };
    });

    return (
        <InvoicesTable
            invoices={invoices}
            count={count}
            searchParams={searchParams}
            tableName={tableName}
        />
    );
};

export default InvoicesTableData;
