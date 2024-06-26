import InventoryTable from '@/app/components/inventory/inventory-table/InventoryTable';
import { getFilteredInventoryCount } from '@/app/lib/data/inventory';
import { getFilteredInventoryByAccountIdRaw } from '@/app/lib/data/inventory/actions';
import { formatCurrencyAsCents, getApp } from '@/app/lib/utils';
import { FC } from 'react';
import { TInventoryDataProps } from './types';

const InventoryTableData: FC<TInventoryDataProps> = async ({ searchParams }) => {
    const { query } = searchParams;
    const { provider, account } = await getApp();

    const locale = provider.address.country.locale;

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
