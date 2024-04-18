import CustomersTable from '@/app/components/customers/customers-table/CustomersTable';
import Search from '@/app/components/search';
// import { getFilteredCustomersCountByAccountId } from '@/app/lib/data/customers';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import {
    getFilteredCustomersByAccountId,
    getFilteredCustomersCountByAccountId
} from '@/app/lib/data/customer';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, Suspense } from 'react';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE_NUMBER } from './constants';
import { StyledBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ searchParams }) => {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const accountId = session.user.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const t = await getI18n();

    const count = await getFilteredCustomersCountByAccountId(accountId, query);
    const customers = await getFilteredCustomersByAccountId(
        accountId,
        query,
        currentPage,
        itemsPerPage
    );

    return (
        <StyledBox component='section' className='section'>
            <Typography variant='h1'>{capitalize(t('customers'))}</Typography>
            <Box component='section' className='tools'>
                <Search placeholder='Search customers...' />
                <CreateButton href='/dashboard/customers/create' name='Create customer' />
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
