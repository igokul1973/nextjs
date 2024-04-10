import TableWrapper from '@/app/components/customers/table-wrapper/TableWrapper';
import CustomersTable from '@/app/components/customers/table-wrapper/customers-table/CustomersTable';
import Search from '@/app/components/search';
// import { getFilteredCustomersCountByAccountId } from '@/app/lib/data/customers';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import { ISearchParams } from '@/app/lib/types';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Suspense } from 'react';
import { StyledBox } from './styled';

interface IProps {
    searchParams: ISearchParams;
}

export default async function Page({ searchParams }: IProps) {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const t = await getI18n();

    // const totalPages = await getFilteredCustomersCountByAccountId(query, session.user.accountId);

    return (
        <StyledBox component='section' className='section'>
            <Typography variant='h1'>{capitalize(t('customers'))}</Typography>
            <Box component='section' className='tools'>
                <Search placeholder='Search customers...' />
                <CreateButton href='/dashboard/customers/create' name='Create customer' />
            </Box>
            <Suspense key={query + currentPage} fallback={<CustomersTable customers={[]} />}>
                <TableWrapper
                    accountId={session.user.accountId}
                    query={query}
                    currentPage={currentPage}
                />
            </Suspense>
        </StyledBox>
    );
}
