import InventoryTable from '@/app/components/inventory/inventory-table/InventoryTable';
import Warning from '@/app/components/warning/Warning';
import { getFilteredInventoryCount } from '@/app/lib/data/inventory';
import { formatCurrencyAsCents, getUser } from '@/app/lib/utils';
import { FC } from 'react';
import { TInventoryDataProps } from './types';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory/actions';

const InventoryTableData: FC<TInventoryDataProps> = async ({ searchParams }) => {
    const { query } = searchParams;
    const { provider, account } = await getUser();

    const locale = provider?.address?.country.locale;

    if (!locale) {
        return (
            <Warning variant='h4'>
                Before viewing inventory please register yourself as a Provider.
            </Warning>
        );
    }

    const count = await getFilteredInventoryCount(account.id, query);
    const rawInventory = await getFilteredInventoryByAccountIdRaw({
        accountId: account.id,
        ...searchParams
    });

    const inventory = rawInventory.map((inventoryItem) => {
        return {
            ...inventoryItem,
            price: formatCurrencyAsCents(inventoryItem.price, locale),
            manufacturerPrice: inventoryItem.manufacturerPrice
                ? formatCurrencyAsCents(inventoryItem.manufacturerPrice, locale)
                : ''
        };
    });

    return (
        <InventoryTable inventory={inventory} count={count} sanitizedSearchParams={searchParams} />
    );
};

export default InventoryTableData;
