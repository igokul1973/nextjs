import {
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER
} from '@/app/[locale]/dashboard/inventory/constants';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InventoryTable from '@/app/components/inventory/inventory-table/InventoryTable';
import Search from '@/app/components/search';
import {
    getFilteredInventoryByAccountId,
    getFilteredInventoryCount
} from '@/app/lib/data/inventory';
import { ISearchParams } from '@/app/lib/types';
import { capitalize } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Typography from '@mui/material/Typography';
import { Suspense } from 'react';
import { StyledSectionBox, StyledToolsBox } from './styled';

interface IProps {
    searchParams: ISearchParams;
}

export default async function Page({ searchParams }: IProps) {
    const session = await auth();
    if (!session) return <div>Not logged in</div>;
    const accountId = session.user.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;
    const t = await getI18n();

    const count = await getFilteredInventoryCount(accountId, query);
    const inventory = await getFilteredInventoryByAccountId(
        accountId,
        query,
        currentPage,
        itemsPerPage,
        orderBy,
        order
    );

    return (
        <StyledSectionBox component='section'>
            <Typography variant='h1'>{capitalize(t('inventory'))}</Typography>
            <StyledToolsBox component='div'>
                <Search placeholder='Search inventory...' />
                <CreateButton
                    href='/dashboard/inventory/create'
                    name={capitalize(t('create inventory item'))}
                />
            </StyledToolsBox>
            <Suspense
                key={query + currentPage}
                fallback={<InventoryTable inventory={[]} count={0} />}
            >
                <InventoryTable inventory={inventory} count={count} />
            </Suspense>
        </StyledSectionBox>
    );
}
