import InvoicesTable from '@/app/components/invoices/InvoicesTable';
import TableWrapper from '@/app/components/invoices/TableWrapper';
import { CreateButton } from '@/app/components/invoices/buttons';
import Search from '@/app/components/search';
import { fetchFilteredInvoicesCount } from '@/app/lib/data/invoices';
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
    const totalPages = await fetchFilteredInvoicesCount(query);

    return (
        <Box component='section' className={styles.section}>
            <Typography variant='h1'>Invoices</Typography>
            <Box component='section' className={styles.tools}>
                <Search placeholder='Search invoices...' />
                <CreateButton href='/dashboard/invoices/create' name='Create invoice' />
            </Box>
            <Suspense key={query + currentPage} fallback={<InvoicesTable invoices={[]} />}>
                <TableWrapper
                    accountId={session.user.accountId}
                    query={query}
                    currentPage={currentPage}
                />
            </Suspense>
        </Box>
    );
}
