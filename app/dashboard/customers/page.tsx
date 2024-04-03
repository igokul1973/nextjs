import CustomersTable from '@/app/components/customers/CustomersTable';
import TableWrapper from '@/app/components/customers/TableWrapper';
import { CreateButton } from '@/app/components/invoices/buttons';
import Search from '@/app/components/search';
import { fetchFilteredCustomersCount } from '@/app/lib/data/customers';
import { ISearchParams } from '@/app/lib/definitions';
import { auth } from '@/auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Suspense } from 'react';
import styles from './page.module.scss';

interface IProps {
    searchParams: ISearchParams;
}

export default async function Page({ searchParams }: IProps) {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchFilteredCustomersCount(query);

    return (
        <Box component='section' className={styles.section}>
            <Typography variant='h1'>Customers</Typography>
            <Box component='section' className={styles.tools}>
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
        </Box>
    );
}
