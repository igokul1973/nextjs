import CustomersTable from '@/app/components/customers/customers-table/CustomersTable';
import Search from '@/app/components/search';
// import { getFilteredCustomersCountByAccountId } from '@/app/lib/data/customers';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import {
    getFilteredCustomersByAccountId,
    getFilteredCustomersCountByAccountId
} from '@/app/lib/data/customer';
import { capitalize, stringToBoolean } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const accountId = session.user.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;
    const showOrg = stringToBoolean(searchParams.showOrg || true.toString());
    const showInd = stringToBoolean(searchParams.showInd || true.toString());
    const t = await getI18n();

    const count = await getFilteredCustomersCountByAccountId(accountId, query, showOrg, showInd);
    const customers = await getFilteredCustomersByAccountId(
        accountId,
        query,
        currentPage,
        itemsPerPage,
        showOrg,
        showInd,
        orderBy,
        order
    );

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
