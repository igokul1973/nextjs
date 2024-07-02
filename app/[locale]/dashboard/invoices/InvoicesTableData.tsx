import InvoicesTable from '@/app/components/invoices/invoices-table/InvoicesTable';
import {
    getFilteredInvoicesByAccountId,
    getFilteredInvoicesByAccountIdCount
} from '@/app/lib/data/invoice';
import { formatCurrencyAsCents, getApp } from '@/app/lib/utils';
import { FC } from 'react';
import { TInvoicesDataProps } from './types';

const InvoicesTableData: FC<TInvoicesDataProps> = async ({ searchParams, tableName }) => {
    const { query } = searchParams;
    const { provider, account } = await getApp();

    const countPromise = await getFilteredInvoicesByAccountIdCount(account.id, query);
    const rawInvoicesPromise = await getFilteredInvoicesByAccountId({
        accountId: account.id,
        ...searchParams
    });

    const [count, rawInvoices] = await Promise.all([countPromise, rawInvoicesPromise]);

    const userAccountCountry = provider.address.country;

    const invoices = rawInvoices.map((invoice) => {
        return {
            ...invoice,
            amount: formatCurrencyAsCents(invoice.amount, userAccountCountry.locale),
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
