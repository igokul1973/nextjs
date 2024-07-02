import CustomersTable from '@/app/components/customers/customers-table/CustomersTable';
import { getFilteredCustomersCountByAccountId } from '@/app/lib/data/customer';
import { getFilteredCustomersByAccountId } from '@/app/lib/data/customer/actions';
import { formatCurrencyAsCents, getApp } from '@/app/lib/utils';
import { EntitiesEnum } from '@prisma/client';
import { FC } from 'react';
import { TCustomersDataProps } from './types';

const CustomersTableData: FC<TCustomersDataProps> = async ({ searchParams }) => {
    const { query, showOrg, showInd } = searchParams;
    const { provider, account } = await getApp();
    const userAccountCountry = provider.address.country;

    const countPromise = getFilteredCustomersCountByAccountId(account.id, query, showOrg, showInd);
    const rawCustomersPromise = getFilteredCustomersByAccountId({
        accountId: account.id,
        ...searchParams
    });
    const [count, rawCustomers] = await Promise.all([countPromise, rawCustomersPromise]);

    const customers = rawCustomers.map((c) => {
        return {
            ...c,
            totalPaid: formatCurrencyAsCents(c.totalPaid, userAccountCountry.locale),
            totalPending: formatCurrencyAsCents(c.totalPending, userAccountCountry.locale),
            customerType: c.customerType as EntitiesEnum
        };
    });

    return <CustomersTable customers={customers} count={count} searchParams={searchParams} />;
};

export default CustomersTableData;
