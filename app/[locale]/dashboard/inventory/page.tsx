import {
    DEFAULT_ITEMS_PER_PAGE,
    DEFAULT_ORDER,
    DEFAULT_ORDER_BY,
    DEFAULT_PAGE_NUMBER
} from '@/app/[locale]/dashboard/inventory/constants';
import { CreateButton } from '@/app/components/buttons/create/CreateButton';
import InventoryTable from '@/app/components/inventory/inventory-table/InventoryTable';
import Search from '@/app/components/search/search';
import Warning from '@/app/components/warning/Warning';
import {
    getFilteredInventoryByAccountIdRaw,
    getFilteredInventoryCount
} from '@/app/lib/data/inventory';
import { getUserWithRelationsByEmail } from '@/app/lib/data/user';
import { capitalize, formatCurrency, getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { auth } from '@/auth';
import { getI18n } from '@/locales/server';
import Typography from '@mui/material/Typography';
import { setStaticParamsLocale } from 'next-international/server';
import { redirect } from 'next/navigation';
import { FC, Suspense } from 'react';
import { StyledSectionBox, StyledToolsBox } from './styled';
import { IProps } from './types';

const Page: FC<IProps> = async ({ params: { locale }, searchParams }) => {
    setStaticParamsLocale(locale);

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
                Before viewing inventory please register yourself as a Provider.
            </Warning>
        );
    }

    const accountId = sessionUser.accountId;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || DEFAULT_PAGE_NUMBER;
    const itemsPerPage = Number(searchParams?.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE;
    const orderBy = searchParams?.orderBy || DEFAULT_ORDER_BY;
    const order = searchParams?.order || DEFAULT_ORDER;

    const count = await getFilteredInventoryCount(accountId, query);
    const rawInventory = await getFilteredInventoryByAccountIdRaw(
        accountId,
        query,
        currentPage,
        itemsPerPage,
        orderBy,
        order
    );

    const inventory = rawInventory.map((inventoryItem) => {
        return {
            ...inventoryItem,
            price: formatCurrency(inventoryItem.price, userAccountCountry.locale),
            manufacturerPrice: inventoryItem.manufacturerPrice
                ? formatCurrency(inventoryItem.manufacturerPrice, userAccountCountry.locale)
                : ''
        };
    });

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
};

export default Page;
