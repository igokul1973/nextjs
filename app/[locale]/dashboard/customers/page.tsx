import CustomersTable from '@/app/components/customers/customers-table/CustomersTable';
import Search from '@/app/components/search/search';
// import { getFilteredCustomersCountByAccountId } from '@/app/lib/data/customers';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import Warning from '@/app/components/warning/Warning';
import {
    getFilteredCustomersByAccountId,
    getFilteredCustomersCountByAccountId
} from '@/app/lib/data/customer';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import {
    capitalize,
    formatCurrency,
    getUserProvider,
    getUserProviderType,
    stringToBoolean
} from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { EntitiesEnum } from '@prisma/client';
import { redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import {
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER
} from './constants';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ searchParams }) => {
    const t = await getI18n();

    const session = await auth();
    const sessionUser = session?.user;
    if (!session || !sessionUser) redirect('/');

    const dbUser = await getUserWithRelationsByEmail(sessionUser.email);

    if (!dbUser) {
        redirect('/');
    }

    const provider = getUserProvider(dbUser);
    const providerType = getUserProviderType(provider);

    const userAccountProvider = provider && providerType && provider[providerType];
    const userAccountCountry = userAccountProvider && userAccountProvider.address?.country;

    if (!userAccountCountry) {
        return (
            <Warning variant='h4'>
                Before creating invoices please register yourself as a Provider.
            </Warning>
        );
    }

    const accountId = sessionUser.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;
    const showOrg = stringToBoolean(searchParams.showOrg || true.toString());
    const showInd = stringToBoolean(searchParams.showInd || true.toString());

    const count = await getFilteredCustomersCountByAccountId(accountId, query, showOrg, showInd);
    const rawCustomers = await getFilteredCustomersByAccountId(
        accountId,
        query,
        currentPage,
        itemsPerPage,
        showOrg,
        showInd,
        orderBy,
        order
    );

    const customers = rawCustomers.map((c) => {
        return {
            ...c,
            totalPaid: formatCurrency(c.totalPaid, userAccountCountry.locale),
            totalPending: formatCurrency(c.totalPending, userAccountCountry.locale),
            customerType: c.customerType as EntitiesEnum
        };
    });

    return (
        <StyledBox component='section' className='section'>
            <Typography variant='h1'>{capitalize(t('customers'))}</Typography>
            <Box component='section' className='tools'>
                <Search placeholder={capitalize(t('by name, phone or email'))} />
                <CreateButton
                    href='/dashboard/customers/create'
                    name={capitalize(t('create customer'))}
                />
            </Box>
            <Suspense
                key={query + currentPage}
                fallback={<CustomersTable customers={[]} count={0} />}
            >
                <CustomersTable customers={customers} count={count} />
            </Suspense>
        </StyledBox>
    );
};

export default Page;
