import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import TableWrapper from '@/app/components/inventory/table-wrapper/TableWrapper';
import InventoryTable from '@/app/components/inventory/table-wrapper/inventory-table/InventoryTable';
import Search from '@/app/components/search';
import { ISearchParams } from '@/app/lib/types';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
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
    const t = await getI18n();
    // const totalPages = await fetchFilteredCustomersCount(query);

    return (
        <Box component='section' className={styles.section}>
            <Typography variant='h1'>{capitalize(t('inventory'))}</Typography>
            <Box component='section' className={styles.tools}>
                <Search placeholder='Search inventory...' />
                <CreateButton href='/dashboard/inventory/create' name='Create inventory' />
            </Box>
            <Suspense key={query + currentPage} fallback={<InventoryTable inventory={[]} />}>
                <TableWrapper
                    accountId={session.user.accountId}
                    query={query}
                    currentPage={currentPage}
                />
            </Suspense>
        </Box>
    );
}
