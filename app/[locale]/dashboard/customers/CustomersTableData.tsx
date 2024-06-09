import CustomersTable from '@/app/components/customers/customers-table/CustomersTable';
import Warning from '@/app/components/warning/Warning';
import {
    getFilteredCustomersByAccountId,
    getFilteredCustomersCountByAccountId
} from '@/app/lib/data/customer';
import { formatCurrencyAsCents, getUser } from '@/app/lib/utils';
import { EntitiesEnum } from '@prisma/client';
import { FC } from 'react';
import { TCustomersDataProps } from './types';

const CustomersTableData: FC<TCustomersDataProps> = async ({ searchParams }) => {
    const { query, showOrg, showInd } = searchParams;
    const { provider, account } = await getUser();
    const userAccountCountry = provider?.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before viewing or creating customers please register yourself as a service provider
                with valid address.
            </Warning>
        );
    }
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
